import { AppDataSource } from './common/dataSource.js'
import express from 'express'
import { server } from './config.js'
import { logger } from './common/logger.js'
import router from './router/index.js'
import { getIPs } from './common/util.js'
import gedeRouter from 'gede-book-server'

await AppDataSource.initialize()

const app = express()

app.use(router)
app.use('/gede', gedeRouter)

app.get('/exit', (_, res) => {
    res.send('系统已退出')
    AppDataSource.destroy()
    process.exit(0)
})

app.listen(server.port, () => {
    getIPs().forEach(ip => {
        logger.debug(`http://${ip}:${server.port}`)
    })
})