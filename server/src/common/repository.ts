import { AppDataSource } from './dataSource.js'
import { User } from './entity.js'

export const userRepository = AppDataSource.getRepository(User)