import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm'
import * as bcrypt from 'bcrypt'

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    email: string

    @Column()
    password: string

    @CreateDateColumn({nullable: true})
    created_at?: Date

    @UpdateDateColumn({nullable: true})
    updated_at?: Date

    @DeleteDateColumn({nullable: true})
    deleted_at?: Date

    // Relations

    // Callbacks

    @BeforeUpdate()
    @BeforeInsert()
    async encryptPassword() {
        this.password = await bcrypt.hash(this.password, 10)
    }
}
