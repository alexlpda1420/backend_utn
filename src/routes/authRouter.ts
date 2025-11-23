import { Router } from "express";
import authController from "../controllers/authController";

const authRouter = Router()

// http://localhost:3000/auth

authRouter.post("/register", authController.register)
authRouter.post("/login", authController.login)

export default authRouter