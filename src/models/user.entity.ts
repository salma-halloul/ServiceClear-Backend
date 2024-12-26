import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    resetCode: string;

    @Column({ nullable: true })
    resetCodeExpiration: Date;

}
