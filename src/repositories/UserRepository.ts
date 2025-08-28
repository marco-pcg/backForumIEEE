import type { Prisma } from '../../generated/prisma/index.js'
import { prisma } from '../db/prisma.ts'
import type { UserProps, UserPropsWithoutId } from '../models/User.ts'

export default class UserRepository {

    static async create(user: UserPropsWithoutId) {
        
        const created = await prisma.user.create({
            data: user
        })

        return created
    }

    static async read(props?: Partial<UserPropsWithoutId>){
        const allUsers = await prisma.user.findMany({ where: props? props : {} })

        return allUsers
    }

    static async readById(id: string){
        const user = await prisma.user.findFirst({
            where: { id }
        })

        return user
    }

    static async update(id: string, user: Partial<UserProps>){

        const updated = await prisma.user.update({
            where: { id },
            data: user
        })

        return updated
    }

    static async delete(id: string){

        const deleted = await prisma.user.delete({
            where: { id }
        })
        
        return deleted
    }

}