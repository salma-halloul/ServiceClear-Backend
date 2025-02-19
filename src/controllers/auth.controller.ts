import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/user.entity";
import { encrypt } from "../helpers/helpers";
import * as dotenv from "dotenv";
import EmailService from "../helpers/sendEmail";
import path from "path";

dotenv.config({ path: 'config.env' });

export class AuthController {

  static async verifyToken(req: Request, res: Response): Promise<Response> {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    try {
      const decodedPayload = encrypt.verifyToken(token);

      if (!decodedPayload) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      return res.status(200).json({ message: "Token is valid", payload: decodedPayload });
    } catch (error) {
      return res.status(500).json({ message: "Error verifying token", error });
    }
  }

  static async signup(req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (!username || !password || !email ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userRepository = AppDataSource.getRepository(User);

    const existingUsername = await userRepository.findOneBy({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if(username.length < 4 || username.length > 15) {
      return res.status(400).json({ message: "Username must be between 4 and 15 characters long" });
    }

    if (!/^[a-zA-Z0-9_]{1,15}$/.test(username)) {
      return res.status(400).json({ message: "Username can only contain letters, numbers and underscores" });
    }

    if (email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Format email invalide" });
      }

      const existingEmail = await userRepository.findOneBy({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const encryptedPassword = await encrypt.encryptpass(password);
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = encryptedPassword;

    await userRepository.save(user);

    return res
      .status(200)
      .json({ message: "User created successfully" });
  }

  static async login(req: Request, res: Response) {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res
          .status(500)
          .json({ message: "Identifier and password required" });
      }

      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const username = /^[a-zA-Z0-9_]{1,15}$/.test(identifier);

      const userRepository = AppDataSource.getRepository(User);

      let user;
      if (isEmail) {
        user = await userRepository.findOne({ where: { email: identifier } });
      } else if (username) {
        user = await userRepository.findOne({ where: { username: identifier } });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await encrypt.comparepassword(user.password, password);
      if (!isPasswordValid) {
        return res.status(404).json({ message: "Invalid password" });
      }

      const token = encrypt.generateToken({ id: user.id });

      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async sendPasswordResetCode(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userRepository = AppDataSource.getRepository(User);

    try {
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

      if (resetCode.length !== 6) {
        return res.status(500).json({ message: "Error generating reset code" });
      }

      const hashedResetCode = await encrypt.hashResetCode(resetCode);

      const resetCodeExpiration = new Date(Date.now() + 3600000); // 1 hour

      user.resetCode = hashedResetCode;
      user.resetCodeExpiration = resetCodeExpiration;

      await userRepository.save(user);

      const subject = "Password Reset Code";
      const templatePath = path.resolve(__dirname, '../templates/passwordReset.html');
      const variables = { name: user.username, resetCode };

      await EmailService.sendEmail(email, subject, templatePath, variables);


      return res.status(200).json({ message: "Password reset code sent successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error sending password reset code", error });
    }
  }

  static async verifyResetCode(req: Request, res: Response): Promise<Response> {
    const { email, resetCode } = req.body;

    if (!email || !resetCode) {
      return res.status(400).json({ message: "Email and reset code are required" });
    }

    if (resetCode.length !== 6) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    const userRepository = AppDataSource.getRepository(User);

    try {
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if reset code matches and is not expired
      const isCodeValid = encrypt.compareResetCode(user.resetCode, resetCode);
      if (!isCodeValid || new Date() > user.resetCodeExpiration) {
        return res.status(400).json({ message: "Invalid or expired reset code" });
      }

      return res.status(200).json({ message: "Reset code verified successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error verifying reset code", error });
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<Response> {
    const { email, newPassword, resetCode } = req.body;

    if (!email || !newPassword || !resetCode) {
      return res.status(400).json({ message: "Email, new password and reset code are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    if (resetCode.length !== 6) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    const userRepository = AppDataSource.getRepository(User);

    try {
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if reset code matches and is not expired
      const isCodeValid = encrypt.compareResetCode(user.resetCode, resetCode);
      if (!isCodeValid || new Date() > user.resetCodeExpiration) {
        return res.status(400).json({ message: "Invalid or expired reset code" });
      }

      const hashedPassword = await encrypt.encryptpass(newPassword);

      user.password = hashedPassword;
      user.resetCode = null as any;
      user.resetCodeExpiration = null as any;

      await userRepository.save(user);

      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error resetting password", error });
    }
  }
}