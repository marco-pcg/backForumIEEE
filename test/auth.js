const test = require('node:test')
const assert = require('node:assert')
const server = require('../src/server.js')

const request = require('supertest')
const jwt = require('jsonwebtoken')

const User = require('../src/models/User.js')

test.suite('Auth Routes', () => {

    test.before(async () => {

        await User.deleteAll()
    })
    
    test.after(async () => {
        await User.deleteAll()

        server.close(() => process.exit(0))
    })

    let refreshToken = null
    let accessToken = null

    test('POST /api/auth/register - success', async () => {
        const res = await request(server)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                username: 'testuser',
                email: 'test@gmail.com',
                password: 'test123'
            })
        
        const cookie = res.headers['set-cookie'][0]
        const refreshToken = cookie.split(';')[0].split('=')[1]
        assert.strictEqual(cookie.startsWith('refreshToken='), true)
        assert.ok(refreshToken.length > 30)
        assert.ok(res.headers['set-cookie'])
        assert.strictEqual(res.status, 201)
        assert.strictEqual(res.body.error, undefined)
        assert.ok(res.body.accessToken)
        assert.ok(res.body.user)
    })

    test('POST /api/auth/login - success', async () => {
        const res = await request(server)
            .post('/api/auth/login')
            .send({
                email: 'test@gmail.com',
                password: 'test123'
            })
        const cookie = res.headers['set-cookie'][0]
        refreshToken = cookie.split(';')[0].split('=')[1]
        accessToken = res.body.accessToken

        assert.strictEqual(cookie.startsWith('refreshToken='), true)
        assert.ok(refreshToken.length > 30)
        assert.ok(res.headers['set-cookie'])
        assert.strictEqual(res.body.error, undefined)    
        assert.strictEqual(res.status, 200)
        assert.ok(res.body.accessToken)
        assert.ok(res.body.user)
    })

    test('POST /api/auth/refresh - no token provided', async () => {
        const loginRes = await request(server)
            .post('/api/auth/refresh')
            .send({
                email: 'test@gmail.com',
                password: 'test123'
            })
        
        assert.strictEqual(loginRes.status, 401)
        assert.strictEqual(loginRes.body.message, 'Missing refresh token')
    })


    test('POST /api/auth/refresh - success', async () => {
        const loginRes = await request(server)
            .post('/api/auth/refresh')
            .send({
                email: 'test@gmail.com',
                password: 'test123'
            })
            .set('Cookie', `refreshToken=${refreshToken}`)
        
        assert.strictEqual(loginRes.body.error, undefined)
        assert.strictEqual(loginRes.status, 200)
        assert.ok(loginRes.body.accessToken)
        assert.ok(loginRes.body.user)
    })

    test('POST /api/auth/protected/me - no refresh token', async () => {
        const res = await request(server)
            .get('/api/auth/protected/me')
        
        assert.strictEqual(res.status, 401)
        assert.strictEqual(res.body.message, 'Missing refresh token')
    })

    test('POST /api/auth/protected/me - no access token', async () => {
        const res = await request(server)
            .get('/api/auth/protected/me')
            .set('Cookie', `refreshToken=${refreshToken}`)
        
        assert.strictEqual(res.status, 401)
        assert.strictEqual(res.body.message, 'No access token provided')
    })

    test('GET /api/auth/protected/me - success', async () => {
        const res = await request(server)
            .get('/api/auth/protected/me')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .set('Authorization', `Bearer ${accessToken}`)
        
        assert.strictEqual(res.status, 200)
        assert.strictEqual(res.body.user.name, 'Test User')
        assert.strictEqual(res.body.user.username, 'testuser')
        assert.strictEqual(res.body.user.email, 'test@gmail.com')
    })

})