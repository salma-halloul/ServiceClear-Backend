import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Service } from "./service.entity";
import { EQuote } from "./enums/EQuote";
@Entity()
export class Quote {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phonenumber: number;

    @Column({nullable: true})
    zip: number;

    @ManyToMany(() => Service)
    @JoinTable()
    services: Service[];

    @Column({nullable: true})
    message: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({default: false})
    read: boolean;

    @Column({
        type: "enum",
        enum: EQuote,
        default: EQuote.PENDING
      })
    status: EQuote;


}
