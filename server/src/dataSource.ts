import { DataSource } from 'typeorm'
import { mysql } from './config'

export const AppDataSource = new DataSource({
    type: 'mysql',
    ...mysql,
    synchronize: true,
})