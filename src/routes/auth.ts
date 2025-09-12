import { Router } from "express";
import AuthController from "../controllers/AuthController.ts";

const router = Router()

router.post('/silent-login', AuthController.silentLogin)

router.post('/login', AuthController.login)

router.post('/register', AuthController.register)

router.post('/refresh', AuthController.refreshToken)


export default router