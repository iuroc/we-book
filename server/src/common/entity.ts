import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'varchar' })
    nickname!: string

    @Column({ type: 'varchar' })
    avatar!: string

    @Column({ name: 'openid', type: 'varchar', unique: true })
    openID!: string

    @Column({ name: 'create_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createAt!: Date
}