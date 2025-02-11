import * as express from "express";
import { ServiceController } from "../controllers/service.controller";
import { authentification } from "../middlewares/auth.middleware";

const Router = express.Router();

Router.post("/create", authentification, ServiceController.createService);
Router.get("/getallvisible", ServiceController.getAllVisibleServices);
Router.get("/getall", authentification, ServiceController.getAllServices);
Router.put("/update/:id", authentification, ServiceController.updateService);
Router.get("/:id", ServiceController.getServiceById);
Router.delete('/delete',  authentification, ServiceController.deleteMultipleServices);
Router.post("/categories", ServiceController.getServicesByCategories);



export { Router as serviceRouter };
