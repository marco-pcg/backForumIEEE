import bcrypt from 'bcrypt'
import type { User } from "../models/User.ts";
import UserRepository from "../repositories/UserRepository.ts";

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

        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(user.password, saltRounds)

        user.password = hashedPassword
        const created = await UserRepository.create(user)

        return created
    }
    private static async hashPassword(password: string){
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        return hashedPassword
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