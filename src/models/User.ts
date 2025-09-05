export interface UserProps {
    id: string,
    name: string,
    password: string,
    username: string,
    email: string,
    readonly role: string
}

export interface UserPropsWithoutId {
    name: string,
    password: string,
    username: string,
    email: string,
    readonly role: string
}

export interface UserMutableProps {
    name: string,
    email: string,
    password: string,
    username: string
}

export class User implements UserPropsWithoutId {
    name: string;
    password: string;
    username: string;
    email: string;
    role: string = "user";

    constructor(user: UserPropsWithoutId){
        this.name = user.name
        this.password = user.password
        this.username = user.username
        this.email = user.email
        this.role = user.role
    }

}