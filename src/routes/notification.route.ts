import * as express from "express";
import NotificationController from "../controllers/notification.controller";

const Router = express.Router();

Router.get("/getall", NotificationController.getAllNotifications);
Router.patch("/:id", NotificationController.markAsRead);

export { Router as notificationRouter };
