import { describe, it } from 'node:test'
import assert from "assert";

import { User, type UserPropsWithoutId } from '../../models/User.ts'
import UserService from '../../services/UserService.ts';

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
            assert.strictEqual(err.message, 'user not found')
        }

    })

    it('should not login with wrong password', async () =>{

        const mockedProps: Partial<UserPropsWithoutId> = {
            email: 'abc@gmail.com',
            password: '1234',
        }

        try{
            const user = await UserService.login(mockedProps.email!, mockedProps.password!)
        }catch(err: Error | any){
            assert.strictEqual(err.message, 'password does not match')
        }
    })

    it('should login with correct e-mail and password', async () => {

        const mockedProps: Partial<UserPropsWithoutId> = {
            email: 'abc@gmail.com',
            password: '123',
        }
        
        try{

            const {
                token
            } = await UserService.login(mockedProps.email!, mockedProps.password!)

            assert.ok(token.length > 100)

        }catch(err: Error | any){
            throw new Error(err.message)
        }

    })

    // delete user

    it('should not delete user with no provided id', async () =>{

        const id = ''

        try{
            const deleted = await UserService.deleteUser({
                id
            })

        }catch(err: Error | any){
            assert.strictEqual(err.message, 'an id or email must be provided to delete a user')
        }


    })

    it('should not delete user with no provided email', async () =>{

        const email = ''

        try{
            const deleted = await UserService.deleteUser({
                email
            })

        }catch(err: Error | any){
            assert.strictEqual(err.message, 'an id or email must be provided to delete a user')
        }

    })

    it('should not delete user with wrong id', async () =>{

        const id = 'asdasdasd'

        try{
            const deleted = await UserService.deleteUser({
                id
            })

        }catch(err: Error | any){
            assert.strictEqual(err.message, 'no user found')
        }
    })

    it('should delete user with correct id', async () =>{
        try{

            const created = await UserService.createUser(new User({
                name: 'abc2',
                password: '123',
                username: 'abc2',
                email: 'abc2@gmail.com',
                role: 'user'
            }))

            const deleted = await UserService.deleteUser({
                id: created.id
            })

            assert.strictEqual(deleted.email, created.email)
            
        }catch(err: Error | any){
            throw err
        }
    })

    it('should not delete user with wrong email', async () =>{

        const email = '123@123.com'

        try{
            const deleted = await UserService.deleteUser({
                email
            })

        }catch(err: Error | any){
            assert.strictEqual(err.message, 'no user found')
        }
    })

    it('should delete user with correct email', async () =>{

        const email = 'abc@gmail.com'

        try{

            const deleted = await UserService.deleteUser({
                email
            })

            assert.strictEqual(deleted.email, email)

        }catch(err: Error | any){
            throw err
        }
    })

})