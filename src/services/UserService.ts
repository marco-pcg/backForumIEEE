import bcrypt from 'bcrypt'
import type { User } from "../models/User.ts";
import UserRepository from "../repositories/UserRepository.ts";
import { Prisma } from '../../generated/prisma/index.js';
import CustomValidationError from '../errors/CustomValidationError.ts';

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
        
        try{

            const hashedPassword = await this.hashPassword(password)

            if(!email || !password){
                throw new CustomValidationError('email and password are required')
            }


            const user = await UserRepository.read({
                email,
                password: hashedPassword
            })

            if(user){
                return user
            }

        }catch(err: any){

            if(err instanceof Prisma.PrismaClientValidationError){
                err.message = 'invalid e-mail address or password'
                throw err

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

    static async readById(id: string){

        const user = await UserRepository.readById(id)

        return user
    }

    static async updateUser(id: string, user: Partial<User>){

        const updated = await UserRepository.update(id, user)

        return updated

    }

    static async deleteUser(id: string){

        const deleted = await UserRepository.delete(id)

        return deleted
    }


}