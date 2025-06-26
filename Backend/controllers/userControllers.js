import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv"
import { genrateJwtToken } from "../utils/genrateToken.js";
import { uploadImage, deleteImage } from "../utils/imageHandler.js";

dotenv.config()


export async function SignUP(req, res) {

    try {

        const { username, email, password, } = req.body

        if (!username, !email, !password) {
            return res.status(401).json({
                message: "Something is Missing",
                success: false
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(401).json({
                message: "user is already registered with this email. Try with diffrent email",
                success: false
            })
        }

        const hashedpassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username,
            email,
            password: hashedpassword
        })

        const token = genrateJwtToken({ userID: existingUser._id })

        return res.status(201).json({
            message: "Account created Sucessfully",
            token,
            user: newUser,
        })


    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }

}

export async function login(req, res) {

    try {
        const { email, password } = req.body

        if (!email, !password) {
            return res.status(401).json({
                message: "Something is Missing",
                success: false
            })
        }

        let user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: "Incorrect Email or password or User might not exist",
                success: false
            })
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password)

        if (!isPasswordMatched) {
            return res.status(401).json({
                message: "Incorrect Email or password",
                success: false
            })
        }

        const token = await genrateJwtToken({ userID: user._id });



        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: true }).json({
            message: "User Logged in sucessfully",
            success: true,
            user: user
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
}

export async function logout(req, res) {

    try {
        return res.cookie('token', "").json({
            message: "User logout sucessfylly",
            success: true
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
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

        const user = await User.findById(userID);

        if (user) {
            return res.status(401).json({
                message: "User not exist",
                success: false
            })
        }


        return res.status(201).json({
            message: "user fetched Sucessfuly",
            user
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
}

export async function editUser(req, res) {

    try {
        const { name, username, bio } = req.body
        const image = req.file
        const userIDbyParam = req.params.id
        const userID = req.user.userID

        if (userIDbyParam !== userID) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Token does not match user ID",
            });
        }


        const user = User.findById(userID)

        let imageID = user.profilePictureID;
        let imageURL = user.profilePicture;


        if (image) {
            try {
                if (imageID) {
                    await deleteImage(imageID)
                }
                const uploadedImage = await uploadImage(image.buffer)
                imageURL = uploadedImage.secure_URL
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

        const updatedUser = await User.findByIdAndUpdate(userID, updatedData, { new: true })

        return res.status(200).json({
            success: true,
            message: "User Sucessfully updated",
            user: updatedUser
        })


    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }

}

export async function GetSuggestedUser(req, res) {

    try {

        const GetSuggestedUser = User.find().select("-password");

        return res.status(200).json({
            success: true,
            message: "Users Sucessfully fetched",
            user: updatedUser
        })


    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }


}

export async function followUnFollow(req, res) {

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
}