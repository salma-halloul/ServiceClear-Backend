import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Service } from "./service.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    icon: string;

    @ManyToMany(() => Service, service => service.categories)
    services: Service[];

}
