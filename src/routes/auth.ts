import { Router } from "express";
import AuthController from "../controllers/AuthController.ts";
import { authenticate, requireRefreshToken } from "../utils/middlewares/auth.ts";

const router = Router()

router.post('/login', AuthController.login)

router.post('/register', AuthController.register)

router.post('/refresh', requireRefreshToken, AuthController.refreshToken)

router.post('/logout', requireRefreshToken, AuthController.logout)

export default router