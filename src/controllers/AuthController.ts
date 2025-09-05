import type { CookieOptions, Request, Response } from "express";
import { verifyRefreshToken } from "../utils/functions/jwt.ts";
import AuthService from "../services/AuthService.ts";
import type { User } from "../models/User.ts";
import CustomValidationError from "../utils/errors/CustomValidationError.ts";
import { Prisma } from "../../generated/prisma/index.js";

export default class AuthController {

    static COOKIE_OPTIONS: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
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

            res.status(201).json({
                data: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                }
            })
        } catch (err: Error | any){
            res.status(err instanceof CustomValidationError ? 400 : 500).json({ error: err.message })
        }

    }


    }

    static async silentLogin (req: Request, res: Response) {

        const token = req.cookies?.refreshToken

        if(!token){
            return res.status(401).json({ message: 'no refresh token' });
        }

        try {
            
            const payload = verifyRefreshToken(token) as { id: string }

            const { accessToken: newAccessToken, refreshToken } = await AuthService.silentLogin({ id: payload.id })

            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return res.status(200).json({ accessToken: newAccessToken })
        } catch (err: Error | any) {

            return res.status(403).json({ message: 'invalid or expired token' })
        }

    }

    static logout (req: Request, res: Response) {
        res.clearCookie('refresh_token');
        res.status(200).json({ message: 'Logged out' });
    }
}