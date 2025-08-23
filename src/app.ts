import { config } from 'dotenv'
config()

import express from 'express'
import cors from 'cors'

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.listen(PORT, () => {
    console.log(`Server running at http://${HOST}:${PORT}`)
})