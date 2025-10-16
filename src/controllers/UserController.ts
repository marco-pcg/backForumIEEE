import type { Request, Response } from "express"
import UserService from "../services/UserService.ts"

export default class UserController {

    static async findAllUsers(req: Request, res: Response){
        try{
            const users = await UserService.readUsers()

            if(users){
                return res.status(200).json(users)
            }
           
            return res.status(200).json([])
        }catch(err: any){
            return res.status(500).json({ error: err.message })
        }
    }

    static findUserById(){
        throw new Error('not implemented')
    }

    static updateUser(){
        throw new Error('not implemented')
    }

    static deleteUser(){
        throw new Error('not implemented')
    }
}