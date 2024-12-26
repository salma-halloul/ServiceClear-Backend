"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AuthController = void 0;
const data_source_1 = require("../config/data-source");
const user_entity_1 = require("../models/user.entity");
const helpers_1 = require("../helpers/helpers");
const dotenv = __importStar(require("dotenv"));
const sendEmail_1 = __importDefault(require("../helpers/sendEmail"));
dotenv.config({ path: 'config.env' });
class AuthController {
    static verifyToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ message: "Token is required" });
            }
            try {
                const decodedPayload = helpers_1.encrypt.verifyToken(token);
                if (!decodedPayload) {
                    return res.status(401).json({ message: "Invalid or expired token" });
                }
                return res.status(200).json({ message: "Token is valid", payload: decodedPayload });
            }
            catch (error) {
                return res.status(500).json({ message: "Error verifying token", error });
            }
        });
    }
    static signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = req.body;
            if (!username || !password || !email) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
            const existingUsername = yield userRepository.findOneBy({ username });
            if (existingUsername) {
                return res.status(400).json({ message: "Username already exists" });
            }
            if (username.length < 4 || username.length > 15) {
                return res.status(400).json({ message: "Username must be between 4 and 15 characters long" });
            }
            if (!/^[a-zA-Z0-9_]{1,15}$/.test(username)) {
                return res.status(400).json({ message: "Username can only contain letters, numbers and underscores" });
            }
            if (email) {
                const emailRegex = /^\S+@\S+\.\S+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({ message: "Format email invalide" });
                }
                const existingEmail = yield userRepository.findOneBy({ email });
                if (existingEmail) {
                    return res.status(400).json({ message: "Email already exists" });
                }
            }
            if (password.length < 8) {
                return res.status(400).json({ message: "Password must be at least 8 characters long" });
            }
            const encryptedPassword = yield helpers_1.encrypt.encryptpass(password);
            const user = new user_entity_1.User();
            user.username = username;
            user.email = email;
            user.password = encryptedPassword;
            yield userRepository.save(user);
            return res
                .status(200)
                .json({ message: "User created successfully" });
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { identifier, password } = req.body;
                if (!identifier || !password) {
                    return res
                        .status(500)
                        .json({ message: "Identifier and password required" });
                }
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
                const username = /^[a-zA-Z0-9_]{1,15}$/.test(identifier);
                const userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
                let user;
                if (isEmail) {
                    user = yield userRepository.findOne({ where: { email: identifier } });
                }
                else if (username) {
                    user = yield userRepository.findOne({ where: { username: identifier } });
                }
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                const isPasswordValid = yield helpers_1.encrypt.comparepassword(user.password, password);
                if (!isPasswordValid) {
                    return res.status(404).json({ message: "Invalid password" });
                }
                const token = helpers_1.encrypt.generateToken({ id: user.id });
                return res.status(200).json({ message: "Login successful", token });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static sendPasswordResetCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
            const userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
            try {
                const user = yield userRepository.findOne({ where: { email } });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
                if (resetCode.length !== 6) {
                    return res.status(500).json({ message: "Error generating reset code" });
                }
                const hashedResetCode = yield helpers_1.encrypt.hashResetCode(resetCode);
                const resetCodeExpiration = new Date(Date.now() + 3600000); // 1 hour
                user.resetCode = hashedResetCode;
                user.resetCodeExpiration = resetCodeExpiration;
                yield userRepository.save(user);
                const text = `Your password reset code is: ${resetCode}`;
                const subject = "Password Reset Code";
                yield sendEmail_1.default.sendEmail(email, subject, text);
                return res.status(200).json({ message: "Password reset code sent successfully" });
            }
            catch (error) {
                return res.status(500).json({ message: "Error sending password reset code", error });
            }
        });
    }
    static verifyResetCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, resetCode } = req.body;
            if (!email || !resetCode) {
                return res.status(400).json({ message: "Email and reset code are required" });
            }
            if (resetCode.length !== 6) {
                return res.status(400).json({ message: "Invalid reset code" });
            }
            const userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
            try {
                const user = yield userRepository.findOne({ where: { email } });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                // Check if reset code matches and is not expired
                const isCodeValid = helpers_1.encrypt.compareResetCode(user.resetCode, resetCode);
                if (!isCodeValid || new Date() > user.resetCodeExpiration) {
                    return res.status(400).json({ message: "Invalid or expired reset code" });
                }
                return res.status(200).json({ message: "Reset code verified successfully" });
            }
            catch (error) {
                return res.status(500).json({ message: "Error verifying reset code", error });
            }
        });
    }
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, newPassword, resetCode } = req.body;
            if (!email || !newPassword || !resetCode) {
                return res.status(400).json({ message: "Email, new password and reset code are required" });
            }
            if (newPassword.length < 8) {
                return res.status(400).json({ message: "Password must be at least 8 characters long" });
            }
            if (resetCode.length !== 6) {
                return res.status(400).json({ message: "Invalid reset code" });
            }
            const userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
            try {
                const user = yield userRepository.findOne({ where: { email } });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                // Check if reset code matches and is not expired
                const isCodeValid = helpers_1.encrypt.compareResetCode(user.resetCode, resetCode);
                if (!isCodeValid || new Date() > user.resetCodeExpiration) {
                    return res.status(400).json({ message: "Invalid or expired reset code" });
                }
                const hashedPassword = yield helpers_1.encrypt.encryptpass(newPassword);
                user.password = hashedPassword;
                user.resetCode = null;
                user.resetCodeExpiration = null;
                yield userRepository.save(user);
                return res.status(200).json({ message: "Password reset successfully" });
            }
            catch (error) {
                return res.status(500).json({ message: "Error resetting password", error });
            }
        });
    }
}
exports.AuthController = AuthController;
