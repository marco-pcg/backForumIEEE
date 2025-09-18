const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User.js')

const router = require('express').Router()

const generateTokens = user => {
    const accessToken = jwt.sign({user}, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
    const refreshToken = jwt.sign({user}, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
    return { accessToken, refreshToken }
}

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

router.post('/refresh', (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).send('Missing refresh token');

    try {

        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

        const tokens = generateTokens({ user: payload.user });
        res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: false,
        });
        
        res.json({ accessToken: tokens.accessToken, user: payload.user });
    } catch (err) {
        res.status(401).send('Invalid token', err);
    }
})

router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken')
    res.sendStatus(200)
})

module.exports = router