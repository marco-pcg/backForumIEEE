import { config } from 'dotenv'
config()

import express from 'express'
import cors from 'cors'
import router from './router.ts'
import type { Server } from 'http'

const PORT = Number(process.env.PORT) || 3000
const HOST = process.env.HOST || 'localhost'

export const app = express()

app.use(cors())
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