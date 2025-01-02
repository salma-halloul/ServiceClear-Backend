import * as express from "express";
import { CategoryController } from "../controllers/category.controller";
import { authentification } from "../middlewares/auth.middleware";

const Router = express.Router();

Router.post("/create",authentification, CategoryController.createCategory);
Router.get("/all", CategoryController.getAllCategories);
Router.put("/update/:id", authentification, CategoryController.updateCategory);
Router.delete("/delete/:id", authentification,CategoryController.deleteCategory);
Router.get("/count", CategoryController.countCategoriesInQuotes);


export { Router as categoryRouter };
