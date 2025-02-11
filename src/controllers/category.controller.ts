import { Request, Response } from "express";
import { Category } from "../models/category.entity";
import { AppDataSource } from "../config/data-source";
import { Quote } from "../models/quote.entity";
import { Not } from "typeorm";

export class CategoryController {
  static async createCategory(req: Request, res: Response): Promise<Response> {
    const { name, icon } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!icon) {
      return res.status(400).json({ message: "Icon is required" });
    }

    const categoryRepository = AppDataSource.getRepository(Category);

    const existingCategory = await categoryRepository.findOneBy({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    try {
      const newCategory = new Category();
      newCategory.name = name;
      newCategory.icon = icon;


      const savedCategory = await categoryRepository.save(newCategory);
      return res.status(201).json(savedCategory);
    } catch (error) {
      return res.status(500).json({ message: "Error creating category", error });
    }
  }

  static async getAllCategories(req: Request, res: Response): Promise<Response> {
    const categoryRepository = AppDataSource.getRepository(Category);

    try {
      const categories = await categoryRepository.find();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving categories", error });
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, icon } = req.body;

    const categoryRepository = AppDataSource.getRepository(Category);

    try {
      const category = await categoryRepository.findOne({ where: { id } });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const existingCategory = await categoryRepository.findOne({
        where: { name, id: Not(id) }
      });
      if (existingCategory) {
        return res.status(400).json({ message: "Category name already exists" });
      }

      if (name){
        category.name = name;
      }
      if (icon) {
        category.icon = icon;
      }
      const updatedCategory = await categoryRepository.save(category);

      return res.status(200).json(updatedCategory);
    } catch (error) {
      return res.status(500).json({ message: "Error updating category", error });
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const categoryRepository = AppDataSource.getRepository(Category);

    try {
      const category = await categoryRepository.findOne({ where: { id } });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      await categoryRepository.remove(category);

      return res.status(200).json({ message: "Category deleted successfully",id });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting category", error });
    }
  }

  static async countCategoriesInQuotes(req: Request, res: Response): Promise<Response> {
    const quoteRepository = AppDataSource.getRepository(Quote);

    try {
      const quotes = await quoteRepository.find({
        relations: ["services", "services.categories"]
      });

      const categoryCountMap: { [key: string]: { name: string, count: number } } = {};

      quotes.forEach(quote => {
        quote.services.forEach(service => {
          service.categories.forEach(category => {
            if (!categoryCountMap[category.id]) {
              categoryCountMap[category.id] = { name: category.name, count: 0 };
            }
            categoryCountMap[category.id].count += 1;
          });
        });
      });
      const categoryCounts = Object.values(categoryCountMap);

      return res.json(categoryCounts);
    } catch (error: unknown) {
      console.error('Error counting categories in quotes:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(500).json({ message: "Error counting categories in quotes", error: errorMessage });
    }
  }
  
}
