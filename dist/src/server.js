"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const data_source_1 = require("./config/data-source");
const error_middleware_1 = require("./middlewares/error.middleware");
const routes_1 = __importDefault(require("./config/routes"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const initialize_1 = require("./config/initialize");
dotenv_1.default.config({ path: 'config.env' });
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001"
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
};
// Apply CORS middleware before other middleware
app.use((0, cors_1.default)(corsOptions));
// Body parser with limits
app.use(express_1.default.json({ limit: '100mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '100mb' }));
app.use((0, compression_1.default)());
app.use((0, helmet_1.default)());
app.use(error_middleware_1.errorHandler);
app.use(routes_1.default);
const PORT = Number(process.env.PORT) || 8000;
const HOST = String(process.env.PGHOST);
// Ensure uploads directory exists
if (!fs_1.default.existsSync('uploads')) {
    fs_1.default.mkdirSync('uploads');
}
// Endpoint to serve image files
const uploadsDir = path_1.default.join(__dirname, '..', 'uploads');
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path_1.default.join(uploadsDir, filename);
    res.sendFile(filePath);
});
// Start the main server
server.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield data_source_1.AppDataSource.initialize();
        console.log(`🗄️  Server Fire on http://${HOST}:${PORT}`);
        console.log("📦 Connected to the database successfully");
       // (0, initialize_1.test)();
    }
    catch (error) {
        console.error("❌ Error during Data Source initialization:", error);
    }
    console.log(`Server is running on port ${PORT}`);
}));
