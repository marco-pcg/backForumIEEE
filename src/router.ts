import { Router, type Application, type Request, type Response } from "express";

const router = Router()

const userRouter = Router()

userRouter.get('/users', (req: Request, res: Response) => {
    res.send('List of users')
})

userRouter.post('login', (req: Request, res: Response) => {
    throw new Error('Not implemented')
})

userRouter.post('register', (req: Request, res: Response) => {
    throw new Error('Not implemented')
})

router.use(userRouter)


const useRouter = (app: Application) => {
    app.use('/api', router)
}



export default { useRouter, router }