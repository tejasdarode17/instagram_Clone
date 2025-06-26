import JWT from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

async function verifyUser(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "User is not authenticated",
            success: true
        })
    }

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
        req.usr = decoded
        next()

    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid Token", error: error.message });
    }

}


export default verifyUser