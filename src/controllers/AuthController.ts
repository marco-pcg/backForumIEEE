import type { Request, Response } from "express";
import { verifyRefreshToken } from "../utils/functions/jwt.ts";
import AuthService from "../services/AuthService.ts";

export default class AuthController {

    static async register(req: Request, res: Response) {

    }

    static login(req: Request, res: Response) {

    }

    static silentLogin (req: Request, res: Response) {

        const token = req.cookies?.refreshToken

        if(!token){
            return res.status(401).json({ message: 'no refresh token' });
        }

        try {
            
            const payload = verifyRefreshToken(token) as { id: string }

            const { accessToken: newAccessToken, refreshToken } = AuthService.silentLogin({ id: payload.id })

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