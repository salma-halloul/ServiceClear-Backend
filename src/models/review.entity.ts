import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { EReview } from "./enums/EReview";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  name : string;

  @Column({
    type: "enum",
    enum: EReview,
    default: EReview.PENDING
  })
  status: EReview;
}
