import type { CookieOptions, Request, Response } from "express";
import AuthService from "../services/AuthService.ts";
import type { User } from "../models/User.ts";
import CustomValidationError from "../utils/errors/CustomValidationError.ts";
import { Prisma } from "../../generated/prisma/index.js";
import UserService from "../services/UserService.ts";
import { generateAccessToken, generateTokens } from "../utils/functions/jwt.ts";
import jwt from 'jsonwebtoken'

export default class AuthController {

    static COOKIE_OPTIONS: CookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    static async register(req: Request, res: Response) {

        const {
            name,
            username,
            email,
            password,
        }: User = req.body

        if(!name || !username || !email || !password){
            return res.status(400).json({ message: 'there is required data missing' })
        }

        try{
            const user = await AuthService.register({
                name,
                email,
                username,
                password
            })

            const tokens = generateTokens(user)

            res.cookie('refreshToken', tokens.refreshToken, this.COOKIE_OPTIONS)

            res.status(201).json({
                user,
                accessToken: tokens.accessToken
            })
        } catch (err: Error | any){
            res.status(err instanceof CustomValidationError ? 400 : 500).json({ error: err.message })
        }

    }

    static async login(req: Request, res: Response) {

        const user = req.body as { email: string, password: string }

        if(!user.password || !user.email){
            return res.status(400).json({ message: 'there is required data missing' })
        }

        try {
            const userFound = await AuthService.login(user.email, user.password)
                        
            if(userFound){
                const tokens = generateTokens(userFound)
                res.cookie('refreshToken', tokens.refreshToken, this.COOKIE_OPTIONS)

                res.cookie('refresh_token', tokens.refreshToken, this.COOKIE_OPTIONS );
                return res.status(200).json({ accessToken: tokens.accessToken, user: userFound })
            }

            res.status(400).json({ error: 'user not found' })
        } catch (err: Error | any) {
            res.status(500).json({ error:err.message })
        }
    }

    static async refreshToken(req: Request, res: Response) {
       try {
        const token = (req as any).token
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET || '')

        const accessToken = generateAccessToken((payload as any).user);
        
        res.json({ accessToken, user: (payload as any).user });
    } catch (err: Error | any) {
        res.status(500).send('invalid token'+ err.message);
    }
    }

    static logout (req: Request, res: Response) {
        res.clearCookie('refreshToken')
        res.sendStatus(200)
    }
}