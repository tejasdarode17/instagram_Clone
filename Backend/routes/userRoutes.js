import express from "express"
import { signUp, login, logout, getUserByID, getSuggestedUser, followUnFollow, editUser } from "../controllers/userControllers.js";
import verifyUser from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const route = express.Router()


route.post("/signup", signUp);
route.post("/login", login);
route.get("/logout", logout);
route.get("/user/:id", getUserByID);
route.get("/suggestion/user", getSuggestedUser);
route.post("/user/follow/:id", verifyUser, followUnFollow);
route.post("/user/edit/:id", upload.single("profilePicture"), verifyUser, editUser);




export default route