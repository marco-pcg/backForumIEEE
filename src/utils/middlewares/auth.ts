import type { Request, Response, NextFunction } from "express";
import { ACCESS_TOKEN_SECRET } from "../functions/jwt.ts";

import jwt from 'jsonwebtoken'
import type { User } from "../../models/User.ts";

// Extend Express Request interface to include 'user'
declare global {
    namespace Express {
        interface Request {
            user: User | any;
            token?: string;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) 
        return res.status(401).json({ message: 'No access token provided' })
    
    try{
        const user = jwt.verify(token, ACCESS_TOKEN_SECRET)
        req.user = user
        next()
    }catch {
        return res.status(403).json({ message: 'Invalid token' })
    }
}

export const requireRole = (role: string) => (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
        return res.status(403).json({ message: 'Forbidden' })
    }
    next()
}

export const requireRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Missing refresh token'});
    req.token = token;
    next()
}