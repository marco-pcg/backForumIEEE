import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || ''
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || ''

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error('JWT secrets are not defined in environment variables');
}

export function generateAccessToken(payload: object, expiresIn: string = '15m') {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn } as jwt.SignOptions);
}

export function generateRefreshToken(payload: object, expiresIn = '7d') {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}