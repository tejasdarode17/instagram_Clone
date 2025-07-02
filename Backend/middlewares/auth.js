import JWT from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

async function verifyUser(req, res, next) {

    const accessToken = req.cookies.accessToken
    
    if (!accessToken) {
        return res.status(401).json({
            message: "User is not authenticated",
            success: false
        })
    }

    try {
        const decoded = JWT.verify(accessToken, process.env.JWT_SECRET_KEY);
        req.user = decoded
        next()

    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid Token", error: error.message });
    }

}


export default verifyUser