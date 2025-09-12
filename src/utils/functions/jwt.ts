import type { Response } from 'express';
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';
import { redis } from './redisClient.ts';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || ''
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || ''
const REFRESH_TOKEN_EXPIRES = Number(process.env.REFRESH_TOKEN_EXPIRES) || 60 * 60 * 24 * 7 // 7 days

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error('JWT secrets are not defined in environment variables');
}

export function generateAccessToken(user: { id: string }, expiresIn: string = '15m') {
  return jwt.sign({ id: user.id}, ACCESS_TOKEN_SECRET, { expiresIn } as jwt.SignOptions);
}

export async function generateRefreshToken(user: { id:string }, expiresIn: string | number = '7d') {
  
  const tokenId = uuidv4()

  const refreshToken = jwt.sign(
    { id: user.id, tokenId },
    REFRESH_TOKEN_SECRET,
    { expiresIn } as jwt.SignOptions
  )

  await redis.set(tokenId, user.id.toString(), {
    expiration: {
      type: 'EX',
      value: REFRESH_TOKEN_EXPIRES
    }
  })

  return refreshToken
}

export function sendRefreshToken(res: Response, token: string) {
  
  res.cookie('refresh_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/auth/refresh',
    secure: false,
    maxAge: REFRESH_TOKEN_EXPIRES * 1000
  })
}

export async function revokeRefreshToken(tokenId: string) {
  await redis.del(tokenId)
}

export async function isRefreshTokenValid(tokenId: string): Promise<boolean> {
  const exists = await redis.exists(tokenId)
  return exists === 1
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}