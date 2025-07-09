import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv"
import mongoose from "mongoose";
import { generateAccessToken, generateRefreshToken } from "../utils/genrateToken.js";
import { uploadImage, deleteImage } from "../utils/imageHandler.js";
import verifyUser from "../middlewares/auth.js";
dotenv.config()


export async function signUp(req, res) {
    try {
        const { username, fullname, email, password } = req.body ?? {};

        if (!username || !fullname || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const emailLower = email.toLowerCase().trim();
        const usernameLower = username.toLowerCase().trim();

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be ≥ 6 characters' });
        }

        const existsByEmail = await User.findOne({ email: emailLower });
        const existsByUsername = await User.findOne({ username: usernameLower });

        if (existsByEmail || existsByUsername) {
            return res.status(409).json({
                success: false,
                message: existsByEmail ? 'Email already registered' : 'Username already taken',
            });
        }

        const hashed = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username: usernameLower,
            name: fullname,
            email: emailLower,
            password: hashed,
        });

        const accessToken = generateAccessToken({ userID: newUser._id });
        const refreshToken = generateRefreshToken({ userID: newUser._id });

        await User.findByIdAndUpdate(newUser._id, { refreshToken });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'Strict',
            path: '/',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            path: '/auth/refresh-token',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const { password: _, refreshToken: __, ...safeUser } = newUser.toObject();
        return res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: safeUser,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body ?? {};

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const accessToken = generateAccessToken({ userID: user._id });
        const refreshToken = generateRefreshToken({ userID: user._id });

        await User.findByIdAndUpdate(user._id, { refreshToken });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "Strict",
            path: "/",
            maxAge: 15 * 60 * 1000, // 15 min
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "Strict",
            path: "/auth/refresh-token",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        const { password: _, refreshToken: __, ...safeUser } = user.toObject();

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: safeUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function getRefreshToken(req, res) {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ success: false, message: "No refresh token provided" });
    }
    try {
        const data = verifyUser(token);
        const user = await User.findById(data.userID);

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ success: false, message: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken({ userID: user._id });

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: "Strict",
            path: "/",
            maxAge: 15 * 60 * 1000, // 15 min
        });

        return res.status(200).json({ success: true });

    } catch (err) {
        console.error("Refresh error:", err.message);
        return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }
}

export async function logout(req, res) {
    try {
        if (req.user?.userID) {
            await User.findByIdAndUpdate(req.user.userID, { refreshToken: null });
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "Strict",
            path: "/",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "Strict",
            path: "/auth/refresh-token", 
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (err) {
        console.error("Logout error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
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

        const user = await User.findById(userID).populate({
            path: "posts",
            select: "caption postImage author likes comments"
        })

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

        const updatedUser = await User.findByIdAndUpdate(userID, updatedData, { new: true }).populate(
            {
                path: "posts",
                select: "caption postImage author likes comments"
            }
        )

        return res.status(200).json({
            success: true,
            message: "User Sucessfully updated",
            user: updatedUser
        })


    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }

}

export const getSuggestedUsers = async (req, res) => {
    try {

        const loggedInId = req.user?.userID

        if (!loggedInId) {
            return res.status(400).json({ success: false, message: "Missing user ID" });
        }

        const me = await User.findById(loggedInId).select("following");
        const excludeIds = [...me.following, loggedInId].map(
            id => new mongoose.Types.ObjectId(id)
        );

        const suggestions = await User.aggregate([
            { $match: { _id: { $nin: excludeIds } } },
            { $sample: { size: 5 } },
            { $project: { password: 0 } }
        ]);

        return res.status(200).json({
            success: true,
            message: "Users successfully fetched",
            users: suggestions,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

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
            return res.status(200).json({
                success: true,
                message: "you Unfollowed",

            })
        } else {
            await User.findByIdAndUpdate(userToBeFollowID, { $push: { followers: userID } })
            await User.findByIdAndUpdate(userID, { $push: { following: userToBeFollowID } })
            return res.status(200).json({
                success: true,
                message: "you followed",

            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}


