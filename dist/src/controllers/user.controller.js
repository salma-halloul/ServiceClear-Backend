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
exports.UserController = void 0;
const user_entity_1 = require("../models/user.entity");
const data_source_1 = require("../config/data-source");
const helpers_1 = require("../helpers/helpers");
class UserController {
    static getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req["currentUser"]) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
            const user = yield userRepository.findOne({
                where: { id: req["currentUser"].id },
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(Object.assign(Object.assign({}, user), { password: undefined }));
        });
    }
    static updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req["currentUser"]) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
            const userId = req["currentUser"].id;
            const { email, username, password } = req.body;
            try {
                const user = yield userRepository.findOne({ where: { id: userId } });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                if (email) {
                    const existingUser = yield userRepository.findOne({ where: { email } });
                    if (existingUser && existingUser.id !== userId) {
                        return res.status(400).json({ message: "Email already in use" });
                    }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        return res.status(400).json({ message: "Invalid email format" });
                    }
                    user.email = email;
                }
                if (username) {
                    const existingUser = yield userRepository.findOne({ where: { username } });
                    if (existingUser && existingUser.id !== userId) {
                        return res.status(400).json({ message: "Username already in use" });
                    }
                    user.username = username;
                }
                if (password) {
                    if (password.length < 8) {
                        return res.status(400).json({ message: "Password must be at least 8 characters long" });
                    }
                    const encryptedPassword = yield helpers_1.encrypt.encryptpass(password);
                    password.password = encryptedPassword;
                }
                const updatedUser = yield userRepository.save(Object.assign({}, user));
                return res.status(200).json(Object.assign(Object.assign({}, updatedUser), { password: undefined }));
            }
            catch (error) {
                return res.status(500).json({ message: "Error updating profile", error });
            }
        });
    }
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req["currentUser"]) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const { oldPassword, newPassword } = req.body;
            const userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
            const userId = req["currentUser"].id;
            try {
                const user = yield userRepository.findOne({ where: { id: userId } });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                const isMatch = helpers_1.encrypt.comparepassword(user.password, oldPassword);
                if (!isMatch) {
                    return res.status(400).json({ message: "Old password is incorrect" });
                }
                if (newPassword.length < 8) {
                    return res.status(400).json({ message: "New password must be at least 8 characters long" });
                }
                user.password = yield helpers_1.encrypt.encryptpass(newPassword);
                yield userRepository.save(user);
                return res.status(200).json({ message: "Password changed successfully" });
            }
            catch (error) {
                return res.status(500).json({ message: "Error changing password", error });
            }
        });
    }
}
exports.UserController = UserController;
