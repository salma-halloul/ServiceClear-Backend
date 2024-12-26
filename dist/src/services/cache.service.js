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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = void 0;
const redis_1 = require("redis");
class CacheService {
    constructor() {
        this.DEFAULT_EXPIRATION = 3600; // 1 hour in seconds
        this.client = (0, redis_1.createClient)();
        this.client.on('error', (err) => console.log('Redis Client Error', err));
        this.connect();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.connect();
            }
            catch (error) {
                console.error('Redis connection error:', error);
            }
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.client.get(key);
                return data ? JSON.parse(data) : null;
            }
            catch (error) {
                console.error('Redis get error:', error);
                return null;
            }
        });
    }
    set(key_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (key, value, expiration = this.DEFAULT_EXPIRATION) {
            try {
                yield this.client.setEx(key, expiration, JSON.stringify(value));
            }
            catch (error) {
                console.error('Redis set error:', error);
            }
        });
    }
    clear(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.del(key);
            }
            catch (error) {
                console.error('Redis delete error:', error);
            }
        });
    }
}
exports.cacheService = new CacheService();
