const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User.js')

const router = require('express').Router()
const { generateTokens, generateAccessToken, requireRefreshToken, authenticate } = require('../middleware/auth.js')

// Register route

router.post('/register', async (req, res) => {
    const { name, username, password, email } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = {
            name,
            username,
            email,
            password: hashedPassword,
            role: 'user', // Default role
        }
        await User.createUser(user)        

        const tokens = generateTokens({
            name: user.name,
            username: user.username,
            role: user.role,
            email: user.email
        })

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
        })

        res.status(201).json({ accessToken: tokens.accessToken, user })
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error creating user' })
    }
})

// Login route

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    
    try {
        const user = await User.findByEmail(email)
        if (!user)
            return res.status(401).json({ error: 'User does not exist' })

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) 
            return res.status(401).json({ error: 'Invalid credentials' })
        
        const reqUser = {  
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role
        }

        const tokens = generateTokens(reqUser)

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
        })

        res.status(200).json({ accessToken: tokens.accessToken, user: reqUser })
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error logging in' })
    }

})

router.post('/refresh', requireRefreshToken, (req, res) => {

    try {
        const token = req.token
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

        const accessToken = generateAccessToken({ user: payload.user });
        
        res.json({ accessToken, user: payload.user });
    } catch (err) {
        res.status(500).send('Invalid token', err);
    }
})

router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken')
    res.sendStatus(200)
})

router.get('/protected/me', requireRefreshToken, authenticate, (req, res) => {
    const user = req.user.user

    res.json({ user })
})

module.exports = router