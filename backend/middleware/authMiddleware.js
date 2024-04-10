/*
Code from https://dvmhn07.medium.com/jwt-authentication-in-node-js-a-practical-guide-c8ab1b432a49
1) Authentication is not the focus of this project
2) There are very limited ways to implement middleware authentication in a react/node.js framework
*/

const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const secretKey = process.env.API_KEY

function verifyToken(req, res, next) {
    const token = req.header('Authorization')
    if (!token) return res.status(401).json({ error: 'Access denied' })
    try {
        const decoded = jwt.verify(token, secretKey)
        req.userId = decoded.userId
        next()
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' })
    }
 };

module.exports = verifyToken;