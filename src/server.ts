import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from 'http';
import fs from 'fs';
import path from 'path';
import { AppDataSource } from "./config/data-source";
import { errorHandler } from "./middlewares/error.middleware";
import routes from "./config/routes";
import compression from 'compression';
import helmet from 'helmet';
import { test } from "./config/initialize";

dotenv.config({ path: 'config.env' });

const app: Application = express();
const server = http.createServer(app);

const allowedOrigins = [
    "http://localhost:4000",
    "http://localhost:4001",
    "http://localhost:3000",
    "http://192.168.1.16:4000",
    "http://192.168.1.16:3000",
    "https://service-clear-frontend-admin.vercel.app",
    "https://service-clear-frontend-client.vercel.app"
    ];
     console.log(allowedOrigins);

const corsOptions = {
    origin: function (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Apply CORS middleware before other middleware
app.use(cors(corsOptions));

// Body parser with limits
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use(compression());
app.use(helmet());
app.use(errorHandler);
app.use(routes);

const PORT: number = Number(process.env.PORT) || 8000;
const HOST: string = String(process.env.PGHOST);

// Start the main server
server.listen(PORT, async () => {
  try {
    await AppDataSource.initialize();
    console.log(`🗄️  Server Fire on http://${HOST}:${PORT}`);
    //console.log("📦 Connected to the database successfully");
    test(); 
  } catch (error) {
    console.error("❌ Error during Data Source initialization:", error);
  }
  console.log(`Server is running on port ${PORT}`);
});
