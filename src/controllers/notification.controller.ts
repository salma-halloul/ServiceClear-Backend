import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Notification } from "../models/notification.entity";

class NotificationController {
  static async createNotification(req: Request, res: Response): Promise<Response> {
    const { message } = req.body;
    const notificationRepository = AppDataSource.getRepository(Notification);

    try {
      const notification = new Notification();
      notification.message = message;

      await notificationRepository.save(notification);
      return res.status(201).json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      return res.status(500).json({ message: "Error creating notification", error });
    }
  }

  static async getAllNotifications(req: Request, res: Response): Promise<Response> {
    const notificationRepository = AppDataSource.getRepository(Notification);

    try {
      const notifications = await notificationRepository.find();
      return res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({ message: "Error fetching notifications", error });
    }
  }

  static async markAsRead(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const notificationRepository = AppDataSource.getRepository(Notification);

    try {
      const notification = await notificationRepository.findOneBy({ id });
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      notification.read = true;
      await notificationRepository.save(notification);

      return res.status(200).json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return res.status(500).json({ message: "Error marking notification as read", error });
    }
  }
}

export default NotificationController;