import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import verifyUser from "../middlewares/auth.js";

const route = express.Router();

route.post("/message/:id", verifyUser, sendMessage)
route.get("/messages/:id", verifyUser, getMessages)

export default route