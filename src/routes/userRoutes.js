import express from "express";
import { getSpecificUser } from "../controller/userController";
import { isLogin } from "../middlewares/isLogin";



const userRoute = express.Router();


//get user profile
userRoute.get("/profile/", isLogin, getSpecificUser);