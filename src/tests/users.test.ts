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

    it('should create user with provided data', async () => {

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

    })

})