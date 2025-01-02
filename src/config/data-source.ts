import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../models/user.entity";
import { Category } from "../models/category.entity";
import { Service } from "../models/service.entity";
import { Review } from "../models/review.entity";
import { Quote } from "../models/quote.entity";
import { Contact } from "../models/contact.entity";

dotenv.config({ path: 'config.env' });

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [User, Category, Service, Review, Quote, Contact], 
    migrations: [__dirname + "/../migrations/*.js"],
    subscribers: [],
});