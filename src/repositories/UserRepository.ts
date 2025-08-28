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

    static async read(props?: Partial<Prisma.UserWhereInput>){
        const allUsers = await prisma.user.findMany({ where: props? props : {} })

        return allUsers
    }

    static async readById(id: string){
        const user = await prisma.user.findFirst({
            where: { id }
        })

        return user
    }

    static async update(props: Prisma.UserWhereUniqueInput, user: Partial<UserProps>){

        const updated = await prisma.user.update({
            where: props,
            data: user
        })

        return updated
    }

    static async delete(props: Prisma.UserWhereUniqueInput){

        const deleted = await prisma.user.delete({
            where: props
        })
        
        return deleted
    }

}