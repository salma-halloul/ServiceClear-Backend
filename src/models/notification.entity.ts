import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({default: false})
    read: boolean;
}