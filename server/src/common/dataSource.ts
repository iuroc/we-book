import { DataSource } from 'typeorm'
import { mysql } from '../config.js'
import { User } from './entity.js'

export const AppDataSource = new DataSource({
    type: 'mysql',
    ...mysql,
    synchronize: true,
    entities: [User]
})