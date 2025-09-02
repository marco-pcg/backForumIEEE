(await import ('dotenv')).config()
import { describe, it, before, after } from 'node:test'
import assert from "assert";
import type { Server } from 'http';

const HOST = process.env.HOST || 'localhost'
const PORT = 3002

const BASE_URL = `http://${HOST}:${PORT}/api`

describe('API - User Workflow', () => {

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




})