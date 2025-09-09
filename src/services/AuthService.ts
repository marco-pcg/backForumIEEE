import type { Request, Response } from "express";
import { Prisma, type User } from "../../generated/prisma/index.js";
import UserRepository from "../repositories/UserRepository.ts";
import CustomValidationError from "../utils/errors/CustomValidationError.ts";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/functions/jwt.ts";
import bcrypt from 'bcrypt'
import { hashPassword } from "../utils/functions/hashPassword.ts";
import type { UserMutableProps, UserPropsWithoutId } from "../models/User.ts";

export default class AuthService {

    static async register(user: UserMutableProps) {

        const {
            name,
            email,
            password,
            username
        } = user

        if(!name || !email || !password || !username){
            throw new CustomValidationError('there is required data missing')
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new CustomValidationError('invalid email address');
        }

        try {

            const hashedPassword = await hashPassword(user.password)

            user.password = hashedPassword
            const created = await UserRepository.create(user)

            return created
        } catch(err: Error | any) {

            if(err instanceof Prisma.PrismaClientValidationError){
                throw new CustomValidationError('invalid user fied(s)')
            }else if(err instanceof CustomValidationError){
                throw err
            }

            throw new Error('an error ocurred during user registration')
        }
    }

    static async silentLogin(user: { id: string }) {

        
        try{
            
            const userFound = await UserRepository.readUnique({ id: user.id })

            if(userFound){
                const accessToken = generateAccessToken({ id: user.id });
                const refreshToken = generateRefreshToken({ id: user.id });

                return { accessToken, refreshToken };
            }

            throw new CustomValidationError('user not found')
        }catch(err: Error | any){

            if (err instanceof Prisma.PrismaClientValidationError){
                throw new CustomValidationError('invalid user id')
                
            }else if (err instanceof CustomValidationError){
                throw err
            }
            throw new Error('error during silent login')
        }
    }


    static async login(email: string, password: string){        
        if(!email || !password){
            throw new CustomValidationError('email and password are required')
        }

        try{
            const user = await UserRepository.readUnique({
                email,
            })

            if(user){            
                if(bcrypt.compareSync(password, user.password)){

                    const accessToken = generateAccessToken({ id: user.id })
                    const refreshToken = generateRefreshToken({ id: user.id })

                    return { accessToken, refreshToken, user }
                }
                throw new CustomValidationError('password does not match')    
            }

            throw new CustomValidationError('user not found')
        }catch(err: any){

            if(err instanceof Prisma.PrismaClientValidationError){
                throw new CustomValidationError('invalid e-mail address or password')

            }else if(err instanceof CustomValidationError){
                throw err
            }

            throw new Error('error logging in user')
        }

    }
}