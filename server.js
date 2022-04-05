import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import router from './router.js'

const server = express()
server.use(cors())
server.use(express.json())

server.use('/olvilista', router)

server.listen(process.env.PORT, () => {
    console.log(`Olvilista project running on port ${process.env.PORT}`)
})

