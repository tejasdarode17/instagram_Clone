import JWT from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config


export function generateAccessToken(payload) {
    return JWT.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "15m",
    });
}

export function generateRefreshToken(payload) {
    return JWT.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
}


export async function verifytoken(token) {
    try {
        let data = await JWT.verify(token, process.env.JWT_TOKEN)
        return data
    } catch (error) {
        return false
    }
}