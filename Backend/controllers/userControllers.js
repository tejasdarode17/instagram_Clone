import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv"
import { generateAccessToken, generateRefreshToken } from "../utils/genrateToken.js";
import { uploadImage, deleteImage } from "../utils/imageHandler.js";

dotenv.config()


export async function signUp(req, res) {
    try {
        const { username, name, email, password } = req.body;

        if (!username || !name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered. Try logging in or use another email.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            name,
            email,
            password: hashedPassword,
        });

        const accessToken = generateAccessToken({ userID: newUser._id });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "Strict",
            path: '/',
            maxAge: 15 * 60 * 1000,
        });

        const { password: _pw, ...sanitized } = newUser.toObject();

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: sanitized,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false,
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false,
            });
        }

        const accessToken = generateAccessToken({ userID: user._id });

        const { password: _pw, ...sanitizedUser } = user.toObject();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "Strict",
            path: '/',
            maxAge: 15 * 60 * 1000,
        }).status(200).json({
            success: true,
            message: "User logged in successfully",
            user: sanitizedUser,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export function logout(req, res) {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'Strict',
            path: '/',
        });
        return res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
}

export async function getUserByID(req, res) {

    try {
        const userID = req.params.id

        if (!userID) {
            return res.status(401).json({
                message: "params not recevied",
                success: false
            })
        }

        const user = await User.findById(userID).select("-password")

        if (!user) {
            return res.status(204).json({
                message: "User not exist",
                success: false
            })
        }

        return res.status(200).json({
            message: "user fetched Sucessfuly",
            user
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

export async function editUser(req, res) {

    try {
        const { name, username, bio } = req.body
        const image = req.file
        const userIDbyParam = req.params.id
        const userID = req.user.userID
        console.log(userID);

        if (!userID) {
            return res.status(401).json({
                success: false,
                message: "Token not provided",
            });
        }

        if (userIDbyParam !== userID) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Token does not match user ID",
            });
        }

        const user = await User.findById(userID)

        let imageID = user.profilePictureID;
        let imageURL = user.profilePicture;


        if (image) {
            try {
                if (imageID) {
                    await deleteImage(imageID)
                }
                const uploadedImage = await uploadImage(image.buffer)
                imageURL = uploadedImage.secure_url
                imageID = uploadedImage.public_id
            } catch (uploadErr) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed",
                    error: uploadErr.message,
                })
            }
        }

        const updatedData = {}
        if (name) updatedData.name = name
        if (username) updatedData.username = username
        if (bio) updatedData.bio = bio
        updatedData.profilePicture = imageURL
        updatedData.profilePictureID = imageID

        const updatedUser = await User.findByIdAndUpdate(userID, updatedData, { new: true }).select("-password")

        return res.status(200).json({
            success: true,
            message: "User Sucessfully updated",
            user: updatedUser
        })


    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }

}

export async function getSuggestedUser(req, res) {
    try {
        const suggestedUsers = await User.find().select("-password");
        return res.status(200).json({
            success: true,
            message: "Users Sucessfully fetched",
            users: suggestedUsers
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

export async function followUnFollow(req, res) {

    try {
        const userToBeFollowID = req.params.id;
        const userID = req.user.userID;

        const userToFollow = await User.findById(userToBeFollowID);
        const user = await User.findById(userID)


        if (!user) {
            res.status(400).json({
                success: false,
                message: "your token is expired",
            })
        }
        if (!userToFollow) {
            res.status(400).json({
                success: false,
                message: "The user you trying to follow might not exist",
            })
        }

        if (userToFollow.followers.includes(userID)) {
            await User.findByIdAndUpdate(userToBeFollowID, { $pull: { followers: userID } })
            await User.findByIdAndUpdate(userID, { $pull: { following: userToBeFollowID } })

            const updatedUser = User.findById(userID);

            return res.status(200).json({
                success: true,
                message: "you Unfollowed",
                updatedUser
            })
        } else {
            await User.findByIdAndUpdate(userToBeFollowID, { $push: { followers: userID } })
            await User.findByIdAndUpdate(userID, { $push: { following: userToBeFollowID } })
            const updatedUser = User.findById(userID);

            return res.status(200).json({
                success: true,
                message: "you Unfollowed",
                updatedUser
            })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}