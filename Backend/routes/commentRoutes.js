import express from "express";
import verifyUser from "../middlewares/auth.js";
import { addComment, updatedComment, deleteComment, getCommentPost } from "../controllers/commentController.js";


const route = express.Router()


route.post("/user/comment/post/:id", verifyUser, addComment);
route.get("/user/comment/post/:id", verifyUser, getCommentPost);
route.put("/user/update/comment/:id", verifyUser, updatedComment)
route.delete("/user/delete/comment/:id", verifyUser, deleteComment)


export default route