import bcrypt from 'bcrypt'
import type { User } from "../models/User.ts";
import UserRepository from "../repositories/UserRepository.ts";
import { Prisma } from '../../generated/prisma/index.js';
import CustomValidationError from '../errors/CustomValidationError.ts';
import jwt from 'jsonwebtoken'
await import('dotenv').then(dotenv => dotenv.config())

export default class UserService {


    static async createUser(user: User) {

        const {
            name,
            email,
            password,
            username
        } = user

        if(!name || !email || !password || !username){
            throw new Error('there is missing information')
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('invalid email address');
        }

        const hashedPassword = await this.hashPassword(user.password)

        user.password = hashedPassword
        const created = await UserRepository.create(user)

        return created
    }

    private static async hashPassword(password: string){
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        return hashedPassword
    }

    static async login(email: string, password: string){
        
        if(!email || !password){
            throw new CustomValidationError('email and password are required')
        }

        const SECRET_KEY = process.env.JWT_SECRET || 'default'

        try{

            const user = await UserRepository.readUnique({
                email,
            })

            if(user){
                
                if(bcrypt.compareSync(password, user.password)){

                    const token = jwt.sign({
                            id: user.id!,
                            email: user.email!,
                            role: user.role!
                        }, 
                        SECRET_KEY, 
                        { expiresIn: '3h' }
                    )

                    return { token }
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


    static async readUsers(){

        const users = await UserRepository.read()

        return users
    }

    static async readUnique(props: Prisma.UserWhereUniqueInput){

        const user = await UserRepository.readUnique(props)

        return user
    }

    static async updateUser({id, email}: Prisma.UserWhereUniqueInput, user: Partial<User>){

        const updated = await UserRepository.update({ 
                id: id ? id : '', 
                email: email ? email : '',
            }, 
            user)

        return updated

    }

    static async deleteUser({id, email}: Prisma.UserWhereUniqueInput){

        if(!id && !email){
            throw new CustomValidationError('an id or email must be provided to delete a user')
        }

        try{

            let deleted;

            if (id) {
                deleted = await UserRepository.delete({ id: id! });
                
            } else {
                deleted = await UserRepository.delete({ email: email! });
            }

            return deleted

        }catch(err: Error | any){

            if(err instanceof Prisma.PrismaClientValidationError){
                throw new CustomValidationError('invalid id or email provided')

            }else if(err instanceof Prisma.PrismaClientKnownRequestError){
                throw new CustomValidationError('no user found')

            }else if(err instanceof Prisma.PrismaClientUnknownRequestError){
                throw new CustomValidationError('no user found')
                                
            }else if(err instanceof CustomValidationError){
                throw err
            }

            throw new Error('user could not be deleted')
        }
    }


}