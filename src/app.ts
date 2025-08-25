import { config } from 'dotenv'
config()

import express from 'express'
import cors from 'cors'
import router from './router.ts'

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

export const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)

export const server = app.listen(PORT, () => {
    console.log(`Server running at http://${HOST}:${PORT}`)
})