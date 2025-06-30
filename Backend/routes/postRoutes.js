import express from "express";
import { createPost, deletePost, getAllPosts, getUserPosts, likePost } from "../controllers/postController.js";
import upload from "../middlewares/multer.js";
import verifyUser from "../middlewares/auth.js";

const route = express.Router();

route.post("/post", upload.single("image"), verifyUser, createPost)
route.get("/post", getAllPosts)
route.get("/post/user", verifyUser, getUserPosts)
route.post("/like/post/:id", verifyUser, likePost)
route.post("/delete/post/:id", verifyUser, deletePost)


export default route