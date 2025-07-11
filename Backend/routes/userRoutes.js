import express from "express"
import { signUp, login, logout, getUserByID, getSuggestedUsers, followUnFollow, editUser, getRefreshToken, } from "../controllers/userControllers.js";
import verifyUser from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const route = express.Router()


route.post("/signup", signUp);
route.post("/login", login);
route.get('/auth/refresh-token', getRefreshToken);

route.get("/logout", logout);
route.get("/user/:id", getUserByID);
route.get("/suggestion/user", verifyUser, getSuggestedUsers);
route.post("/user/follow/:id", verifyUser, followUnFollow);
route.post("/user/edit/:id", upload.single("profilePicture"), verifyUser, editUser);




export default route