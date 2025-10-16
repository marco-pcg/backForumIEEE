import { config } from 'dotenv'
config()

import express from 'express'
import cors from 'cors'
import router from './router.ts'
import type { Server } from 'http'
import cookieParser from 'cookie-parser'

const HOST = process.env.HOST || 'localhost'
const PORT = Number(process.env.PORT) || 3000

const FRONTEND_CLIENT_HOST = process.env.FRONTEND_CLIENT_HOST || 'localhost'
const FRONTEND_CLIENT_PORT = Number(process.env.FRONTEND_CLIENT_PORT) || 3000

export const app = express()

app.use(cookieParser())
app.use(cors({
    origin: `http://${FRONTEND_CLIENT_HOST}:${FRONTEND_CLIENT_PORT}`,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)

export const listen = (port: number = PORT) => {
    return app.listen(port, () => {
            console.log(`Server running at http://${HOST}:${port}`)
        })
}

if (import.meta.main) {

    const server: Server = listen()
}