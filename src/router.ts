import { Router } from "express";
import UserController from "./controllers/UserController.ts";
import userRouter from './routes/user.ts'

const router = Router()

router.post('login', UserController.login)
router.post('register', UserController.register)

router.use('/users', userRouter)

export default router