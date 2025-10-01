import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';
import { redis } from './redisClient.ts';
import type { User } from '../../models/User.ts';

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || ''
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || ''
const REFRESH_TOKEN_EXPIRES = Number(process.env.REFRESH_TOKEN_EXPIRES) || 60 * 60 * 24 * 7 // 7 days

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error('JWT secrets are not defined in environment variables');
}

export const generateAccessToken = (user: User) => {
    return jwt.sign({ user }, ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
}

export const generateTokens = (user: User) => {
    const accessToken = jwt.sign({ user }, ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
    const refreshToken = jwt.sign({user}, REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
    return { accessToken, refreshToken }
}