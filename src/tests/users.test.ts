import { describe, it } from 'node:test'
import assert from "assert";

import { User, type UserPropsWithoutId } from '../models/User.ts'
import UserService from '../services/UserService.ts';

describe('User Unit Tests Workflow', () => {
    
    it('should not create user with empty name', async () => {


        const mockedProps: UserPropsWithoutId = {
            name: '',
            password: '123',
            username: 'abc',
            email: 'abc@gmail.com',
            role: 'user'
        }

        try{
            const _user = new User(mockedProps)

            const user = await UserService.createUser(_user)

        }catch(err: any){

            assert.strictEqual(err.message, 'there is missing information')
        }

    })

    it('should not register user with invalid e-mail', async () =>{

        const mockedProps: UserPropsWithoutId = {
            name: 'abc',
            password: '123',
            username: 'abc2',
            email: 'avcgassas',
            role: 'user'
        }

        try{
            const _user = new User(mockedProps)
            const user = await UserService.createUser(_user)

        }catch(err: any){

            assert.strictEqual(err.message, 'invalid email address')
        }
    })

    it('should register user with valid e-mail', async () =>{

        const mockedProps: UserPropsWithoutId = {
            name: 'abc',
            password: '123',
            username: 'abc',
            email: 'abc@gmail.com',
            role: 'user'
        }

    
        const _user = new User(mockedProps)
        const user = await UserService.createUser(_user)

        assert.strictEqual(user.name, mockedProps.name)
        assert.strictEqual(user.email, mockedProps.email)
        // password IS encrypted
        assert.ok(user.password.length > 30)
    })

    it('should not login without e-mail', async () =>{

        const mockedProps: Partial<UserPropsWithoutId> = {
            email: '',
            password: '123',
        }

        try{
            const user = await UserService.login(mockedProps.email!, mockedProps.password!)

        }catch(err: any){

            assert.strictEqual(err.message, 'email and password are required')

        }

    })

    it('should not login without password', async () =>{

        const mockedProps: Partial<UserPropsWithoutId> = {
            email: 'a@gmail.com',
            password: '',
        }

        try{
            const user = await UserService.login(mockedProps.email!, mockedProps.password!)

        }catch(err: any){

            assert.strictEqual(err.message, 'email and password are required')

        }
    })

    it('should not login with wrong e-mail', async () =>{

        const mockedProps: Partial<UserPropsWithoutId> = {
            email: 'a@gmail.com',
            password: '123',
        }

        try{
            const user = await UserService.login(mockedProps.email!, mockedProps.password!)

        }catch(err: any){
            assert.strictEqual(err.message, 'invalid e-mail address or password')
        }

    })

    it('should not login with wrong password', async () =>{

        const mockedProps: Partial<UserPropsWithoutId> = {
            email: 'abc@gmail.com',
            password: '1234',
        }

        try{
            const user = await UserService.login(mockedProps.email!, mockedProps.password!)
        }catch(err: any){
            assert.strictEqual(err.message, 'invalid e-mail address or password')
        }
    })

})