import { Router } from "express";
import userRouter from './routes/user.ts'
import authRouter from './routes/auth.ts'

const router = Router()

router.use('/users', userRouter)
router.use('/auth', authRouter)

export default router