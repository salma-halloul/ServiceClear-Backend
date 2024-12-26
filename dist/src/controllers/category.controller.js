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
exports.CategoryController = void 0;
const category_entity_1 = require("../models/category.entity");
const data_source_1 = require("../config/data-source");
class CategoryController {
    static createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            const categoryRepository = data_source_1.AppDataSource.getRepository(category_entity_1.Category);
            const existingCategory = yield categoryRepository.findOneBy({ name });
            if (existingCategory) {
                return res.status(400).json({ message: "Category name already exists" });
            }
            try {
                const newCategory = new category_entity_1.Category();
                newCategory.name = name;
                const savedCategory = yield categoryRepository.save(newCategory);
                return res.status(201).json(savedCategory);
            }
            catch (error) {
                return res.status(500).json({ message: "Error creating category", error });
            }
        });
    }
    static getAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryRepository = data_source_1.AppDataSource.getRepository(category_entity_1.Category);
            try {
                const categories = yield categoryRepository.find();
                return res.status(200).json(categories);
            }
            catch (error) {
                return res.status(500).json({ message: "Error retrieving categories", error });
            }
        });
    }
    static updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            const categoryRepository = data_source_1.AppDataSource.getRepository(category_entity_1.Category);
            try {
                const category = yield categoryRepository.findOne({ where: { id } });
                if (!category) {
                    return res.status(404).json({ message: "Category not found" });
                }
                const existingCategory = yield categoryRepository.findOneBy({ name });
                if (existingCategory) {
                    return res.status(400).json({ message: "Category name already exists" });
                }
                category.name = name;
                const updatedCategory = yield categoryRepository.save(category);
                return res.status(200).json(updatedCategory);
            }
            catch (error) {
                return res.status(500).json({ message: "Error updating category", error });
            }
        });
    }
    static deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const categoryRepository = data_source_1.AppDataSource.getRepository(category_entity_1.Category);
            try {
                const category = yield categoryRepository.findOne({ where: { id } });
                if (!category) {
                    return res.status(404).json({ message: "Category not found" });
                }
                yield categoryRepository.remove(category);
                return res.status(200).json({ message: "Category deleted successfully", id });
            }
            catch (error) {
                return res.status(500).json({ message: "Error deleting category", error });
            }
        });
    }
}
exports.CategoryController = CategoryController;
