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
exports.test = void 0;
const user_entity_1 = require("../models/user.entity");
const data_source_1 = require("./data-source");
const helpers_1 = require("../helpers/helpers");
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("entered");
        const userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
        const existingUser = yield userRepository.count();
        console.log(existingUser);
        // Check if there are less than 1 admin, create the default ones
        if (existingUser < 1) {
            const encryptedPassword = yield helpers_1.encrypt.encryptpass("admin123");
            const user = new user_entity_1.User();
            user.username = "Youssef Magdich";
            user.email = "admin@gmail.com";
            user.password = encryptedPassword;
            yield userRepository.save(user);
            console.log("created");
        }
    }
    catch (error) {
        console.error('Error creating default admin:', error);
    }
});
exports.test = test;
