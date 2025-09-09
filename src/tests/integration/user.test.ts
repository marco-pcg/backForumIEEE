(await import ('dotenv')).config()
import { describe, it, before, after } from 'node:test'
import assert from "assert";
import type { Server } from 'http';

const HOST = process.env.HOST || 'localhost'
const PORT = 3002

const BASE_URL = `http://${HOST}:${PORT}/api`

describe('API - User', () => {

    let _server: Server

    before(async () =>{

        _server = (await import('../../app.ts')).listen(PORT)
        
        await new Promise(resolve => _server.once('listening', resolve))
    })

    after((done: any) => _server.close(done))

    it('should not receive no users', async () => {

        const response = await fetch(`${BASE_URL}/users`)

        assert.strictEqual(response.status, 200)
        
        const users = await response.json()

        assert.ok(Array.isArray(users))
        assert.strictEqual(users.length, 0)

    })

    it('should not create user with missing fields', async () => {

        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'testuser' }) // missing password
        })

        assert.strictEqual(response.status, 400)

        const error = await response.json()
        assert.strictEqual(error.message, 'there is required data missing')

    })



})