import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { Category } from "./category.entity";

  @Entity()
  export class Service {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column()
    name: string;
  
    @Column()
    description: string;

    @ManyToMany(() => Category)
    @JoinTable({
      name: "service_categories",
      joinColumn: { name: "serviceId", referencedColumnName: "id" },
      inverseJoinColumn: { name: "categoryId", referencedColumnName: "id" }
    })
    categories: Category[];
  
    @Column()
    visible: boolean;

    @Column("text", { array: true })
    images: string[];  
  }
  
  