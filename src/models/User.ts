import UserRepository from "../repositories/UserRepository.ts";

export interface UserProps {
    id: string,
    name: string,
    password: string,
    username: string,
    email: string,
    role: string
}

export interface UserPropsWithoutId {
    name: string,
    password: string,
    username: string,
    email: string,
    role: string
}

export class User implements UserPropsWithoutId {

    name: string;
    password: string;
    username: string;
    email: string;
    role: string;

    constructor(user: UserPropsWithoutId){
        this.name = user.name
        this.password = user.password
        this.username = user.username
        this.email = user.email
        this.role = user.role
    }

    // create(user: UserPropsWithoutId) {
    //     UserRepository.create(user)
    // }

    // async read(){
    //     const users = await UserRepository.read()
    //     return users
    // }

    // async update(id: string, user: Partial<UserProps>){
    //     const updated = await UserRepository.update(id, user)
    //     return updated
    // }

    // async delete(id: string){
    //     const deleted = await UserRepository.delete(id)
    //     return deleted
    // }


}