import * as express from "express";
import { authentification } from "../middlewares/auth.middleware";
import { ContactController } from "../controllers/contact.controller";

const Router = express.Router();

Router.post("/create", ContactController.createContact);
Router.get("/getall",authentification, ContactController.getAllContacts);
Router.get("/:id",authentification, ContactController.getContactById);
Router.delete("/delete",authentification, ContactController.deleteMultipleContacts);
Router.put("/update",authentification,  ContactController.updateContactReadStatus);



export { Router as contactRouter };