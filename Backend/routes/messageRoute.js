import express from "express";
import { sendMessage } from "../controllers/messageController.js";
import verifyUser from "../middlewares/auth.js";

const route = express.Router();

route.post("/message/:id", verifyUser, sendMessage)

export default route