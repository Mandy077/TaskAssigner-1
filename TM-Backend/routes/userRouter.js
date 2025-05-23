import express from "express";
import { register, verifyUser, logOut, login, resetPasswordRequest, resetPassword, getUserTasks } from "../controllers/userController.js";
import { verifyUsery } from "../middlewares/userAuth.js";



const userRouter = express.Router();

userRouter.post("/register",register);
userRouter.post("/login",login); 
userRouter.post("/logout",logOut); 
userRouter.get("/verify-user",verifyUser); 
userRouter.post("/reset-password-request",resetPasswordRequest);
userRouter.post("/reset-password",resetPassword);
userRouter.get("/tasks",verifyUsery,getUserTasks);

export default userRouter;