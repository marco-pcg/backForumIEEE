const jwt = require('jsonwebtoken')

exports.generateAccessToken = user => {
    return jwt.sign({ user }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
}

exports.generateTokens = user => {
    const accessToken = jwt.sign({ user }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
    const refreshToken = jwt.sign({user}, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
    return { accessToken, refreshToken }
}

exports.authenticate = (req, res, next) => {

    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) 
        return res.status(401).json({ message: 'No access token provided' })
    
    try{
        const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        req.user = user
        next()
    }catch {
        return res.status(403).json({ message: 'Invalid token' })
    }
}

exports.requireRole = role => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ message: 'Forbidden' })
    }
    next()
}

exports.requireRefreshToken = (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Missing refresh token'});
    req.token = token;
    next()
}