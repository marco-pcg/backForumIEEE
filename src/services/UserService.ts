import bcrypt from 'bcrypt'
import type { User } from "../models/User.ts";
import UserRepository from "../repositories/UserRepository.ts";
import { Prisma } from '../../generated/prisma/index.js';
import CustomValidationError from '../utils/errors/CustomValidationError.ts';
import { hashPassword } from '../utils/functions/hashPassword.ts';
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
                throw new Error('there is required data missing')
            }
    
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('invalid email address');
            }
    
            const hashedPassword = await hashPassword(user.password)
    
            user.password = hashedPassword
            const created = await UserRepository.create(user)
    
            return created
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