import db from '../db/knex.ts'
import { v4 } from 'uuid'
import type { UserProps, UserPropsWithoutId } from '../models/User.ts'

export default class UserRepository {

    static TABLE_NAME = 'users'

    static create(user: UserPropsWithoutId) {
        
        const id = v4()

        return db(this.TABLE_NAME)
            .insert({ id, ...user})
    }

    static read(){
        return db(this.TABLE_NAME)
            .select(
                'id',
                'name',
                'username',
                'email',
            )
    }

    static readById(id: string){
        return db(this.TABLE_NAME)
            .where({ id })

    }

    static update(id: string, user: Partial<UserProps>){

        return db(this.TABLE_NAME)
            .where({ id })
            .update({ ...user })
            .then(count => count > 0)
    }

    static delete(id: string){

        return db(this.TABLE_NAME)
            .where({ id })
            .del()
            .then(count => count > 0)
    }

}