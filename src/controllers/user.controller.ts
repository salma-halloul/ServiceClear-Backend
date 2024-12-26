
import { Request, Response } from "express";
import { User } from "../models/user.entity";
import { AppDataSource } from "../config/data-source";
import { encrypt } from "../helpers/helpers";

export class UserController {

  static async getProfile(req: Request, res: Response) {
    if (!(req as any)["currentUser"]) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: (req as any)["currentUser"].id },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ ...user, password: undefined });
  }

  static async updateProfile(req: Request, res: Response) {
    if (!(req as any)["currentUser"]) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const userId = (req as any)["currentUser"].id;
    const { email,username , password } = req.body;

    try {
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (email) {
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "Email already in use" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
        user.email = email;
      }

        if (username) {
            const existingUser = await userRepository.findOne({ where: { username } });
            if (existingUser && existingUser.id !== userId) {
            return res.status(400).json({ message: "Username already in use" });
            }
            user.username = username;
        }

      if (password) {
        if (password.length < 8) {
          return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        const encryptedPassword = await encrypt.encryptpass(password);
        password.password = encryptedPassword;
      }

      const updatedUser = await userRepository.save({ ...user });

      return res.status(200).json({ ...updatedUser, password: undefined });
    } catch (error) {
      return res.status(500).json({ message: "Error updating profile", error });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    if (!(req as any)["currentUser"]) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { oldPassword, newPassword } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const userId = (req as any)["currentUser"].id;

    try {
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = encrypt.comparepassword(user.password, oldPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
      }

      user.password = await encrypt.encryptpass(newPassword);
      await userRepository.save(user);

      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error changing password", error });
    }
  }
}

