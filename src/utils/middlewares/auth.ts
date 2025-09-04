import type { Request, Response, NextFunction } from "express";

const verify = (await import("jsonwebtoken")).verify

// Extend Express Request interface to include 'user'
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


export const authenticate = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization']
    
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader && authHeader.split(' ')[1]

    try {

        const payload = verify(token as string, process.env.ACCESS_TOKEN_SECRET as string) as any

        req.user = payload
        next()
    }catch (err: any | Error) {
        return res.status(403).json({ message: 'invalid or expired token' })
    }

}