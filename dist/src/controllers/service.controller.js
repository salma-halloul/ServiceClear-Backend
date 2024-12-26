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
exports.ServiceController = void 0;
const service_entity_1 = require("../models/service.entity");
const data_source_1 = require("../config/data-source");
const category_entity_1 = require("../models/category.entity");
class ServiceController {
    static createService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, categoryIds, images, visible } = req.body;
            if (!name || !description || !categoryIds || !images || !visible) {
                return res.status(400).json({ message: "Name, description,model ,price and at least one category are required" });
            }
            const ServiceRepository = data_source_1.AppDataSource.getRepository(service_entity_1.Service);
            const categoryRepository = data_source_1.AppDataSource.getRepository(category_entity_1.Category);
            try {
                const categories = yield categoryRepository.findByIds(categoryIds);
                if (categories.length !== categoryIds.length) {
                    return res.status(404).json({ message: "One or more categories not found" });
                }
                const service = new service_entity_1.Service();
                service.name = name;
                service.description = description;
                service.categories = categories;
                service.images = images;
                service.visible = visible;
                service.createdAt = new Date();
                yield ServiceRepository.save(service);
                return res.status(201).json(service);
            }
            catch (error) {
                console.error('Error in createService:', error);
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                return res.status(500).json({ message: "Error creating service", error: errorMessage });
            }
        });
    }
    static getAllVisibleServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /* const CACHE_KEY = `visible_Services`;
           
                 // Try to get from cache first
                 const cachedData = await cacheService.get(CACHE_KEY);
                 if (cachedData) {
                   return res.json(cachedData);
                 }*/
                const serviceRepository = data_source_1.AppDataSource.getRepository(service_entity_1.Service);
                const visibleServices = yield serviceRepository.find({ where: { visible: true } });
                // Save to cache
                // await cacheService.set(CACHE_KEY, visibleServices);
                return res.json(visibleServices);
            }
            catch (error) {
                console.error("Error fetching visible services:", error);
                return res.status(500).json({ message: "Error fetching visible services" });
            }
        });
    }
    static getAllServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ServiceRepository = data_source_1.AppDataSource.getRepository(service_entity_1.Service);
            try {
                const [Services] = yield ServiceRepository.findAndCount({
                    relations: ["categories"],
                });
                const mappedServices = Services.map(service => ({
                    id: service.id,
                    images: service.images,
                    name: service.name,
                    visible: service.visible,
                    categories: service.categories.map(category => ({
                        id: category.id,
                        name: category.name,
                    })),
                }));
                return res.json({
                    data: mappedServices,
                });
            }
            catch (error) {
                console.error('Error in getAllServices:', error);
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                return res.status(500).json({ message: "Error retrieving Services", error: errorMessage });
            }
        });
    }
    static updateService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, description, categoryIds, images, visible } = req.body;
            const ServiceRepository = data_source_1.AppDataSource.getRepository(service_entity_1.Service);
            const categoryRepository = data_source_1.AppDataSource.getRepository(category_entity_1.Category);
            try {
                const service = yield ServiceRepository.findOne({
                    where: { id },
                    relations: ["categories"],
                });
                if (!service) {
                    return res.status(404).json({ message: "service not found" });
                }
                if (name) {
                    service.name = name;
                }
                if (description) {
                    service.description = description;
                }
                if (categoryIds && categoryIds.length > 0) {
                    const categories = yield categoryRepository.findByIds(categoryIds);
                    if (categories.length !== categoryIds.length) {
                        return res.status(404).json({ message: "One or more categories not found" });
                    }
                    service.categories = categories;
                }
                if (images) {
                    service.images = images;
                }
                if (visible !== undefined) {
                    service.visible = visible;
                }
                yield ServiceRepository.save(service);
                return res.status(200).json(service);
            }
            catch (error) {
                console.error('Error in updateService:', error);
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                return res.status(500).json({ message: "Error updating service", error: errorMessage });
            }
        });
    }
    static getServiceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const ServiceRepository = data_source_1.AppDataSource.getRepository(service_entity_1.Service);
            try {
                const service = yield ServiceRepository.findOne({ where: { id }, relations: ["categories"], });
                if (!service) {
                    return res.status(404).json({ message: "service not found" });
                }
                return res.json(service);
            }
            catch (error) {
                console.error('Error in getServiceById:', error);
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                return res.status(500).json({ message: "Error retrieving service", error: errorMessage });
            }
        });
    }
    static deleteMultipleServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ids } = req.body;
            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ message: "No service IDs provided" });
            }
            const ServiceRepository = data_source_1.AppDataSource.getRepository(service_entity_1.Service);
            try {
                const Services = yield ServiceRepository.findByIds(ids);
                if (Services.length === 0) {
                    return res.status(404).json({ message: "No Services found with the provided IDs" });
                }
                // Supprimer les produits
                yield ServiceRepository.remove(Services);
                return res.status(200).json({ message: "Services deleted successfully", ids });
            }
            catch (error) {
                console.error('Error in deleteMultipleServices:', error);
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                return res.status(500).json({ message: "Error deleting Services", error: errorMessage });
            }
        });
    }
}
exports.ServiceController = ServiceController;
