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
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRouter = void 0;
const express = __importStar(require("express"));
const service_controller_1 = require("../controllers/service.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const Router = express.Router();
exports.serviceRouter = Router;
Router.post("/create", auth_middleware_1.authentification, service_controller_1.ServiceController.createService);
Router.get("/getallvisible", service_controller_1.ServiceController.getAllVisibleServices);
Router.get("/getall", auth_middleware_1.authentification, service_controller_1.ServiceController.getAllServices);
Router.put("/update/:id", auth_middleware_1.authentification, service_controller_1.ServiceController.updateService);
Router.get("/:id", service_controller_1.ServiceController.getServiceById);
Router.delete('/delete', auth_middleware_1.authentification, service_controller_1.ServiceController.deleteMultipleServices);
