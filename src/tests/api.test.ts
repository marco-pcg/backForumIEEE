(await import ('dotenv')).config()
import { describe, it, before, after } from 'node:test'
import assert from "assert";
import type { Server } from 'http';

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3000

const BASE_URL = `http://${HOST}:${PORT}`

describe('API Workflow', () => {

    let _server: Server

    before(async () =>{

        _server = (await import('../app.ts')).server
        
        await new Promise(resolve => _server.once('listening', resolve))
    })

    after((done: any) => _server.close(done))

    it('should return empty array of users', async () => {

        const res = await fetch(`${BASE_URL}/api/users`)

        assert.strictEqual(res.status, 200)

        const users = await res.json()

        assert.ok(Array.isArray(users))
        assert.strictEqual(users.length, 0)

    })

    

})