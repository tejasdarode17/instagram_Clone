import JWT from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config


export async function genrateJwtToken(payload) {
    let token = JWT.sign(payload, process.env.JWT_SECRET_KEY);
    return token
}