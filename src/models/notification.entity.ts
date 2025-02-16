import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ENotification } from "./enums/ENotification";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: false })
    read: boolean;

    @Column({
        type: "enum",
        enum: ENotification,
    })
    type: ENotification;


}