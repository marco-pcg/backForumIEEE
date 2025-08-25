import { Router, type Application, type Request, type Response } from "express";

const router = Router()

router.get('/users', (req: Request, res: Response) => {
    res.send({msg: 'List of users'})
})

router.post('login', (req: Request, res: Response) => {
    throw new Error('Not implemented')
})

router.post('register', (req: Request, res: Response) => {
    throw new Error('Not implemented')
})

export default router