import express from "express";
import { createPost } from "../controllers/postController.js";
import upload from "../middlewares/multer.js";
import verifyUser from "../middlewares/auth.js";

const route = express.Router();

route.post("/post", upload.single("image"), verifyUser, createPost)


export default route