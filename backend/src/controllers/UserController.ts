import { Request, Response } from "express";
import { prisma } from "../database/prismaClient";

import bcrypt from "bcrypt";

export class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      let user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        return res.json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      return res.json({
        message: `User ${user.name} was created successfully!`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async listUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();

      const allUsers = users.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
          role: user.role,
        };
      });

      return res.json({ users: allUsers });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const { email } = req.params;

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const { name, currentPassword, newPassword } = req.body;

      if (name && currentPassword && newPassword) {
        return res.status(400).json({
          message: "You can't update name and password at the same time",
        });
      }

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (currentPassword && newPassword) {
        const isPasswordCorrect = await bcrypt.compare(
          currentPassword,
          user.password
        );

        if (!isPasswordCorrect) {
          return res.status(401).json({ message: "Password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await prisma.user.update({
          where: { email },
          data: { password: hashedPassword },
        });

        return res.status(201).json({
          message: `User ${updatedUser.name} password was updated successfully!`,
        });
      }

      if (name) {
        const updatedUser = await prisma.user.update({
          where: { email },
          data: { name },
        });

        return res.status(201).json({
          message: `User ${updatedUser.name} name was updated successfully!`,
        });
      }

      return res.status(400).json({ message: "Nothing to updated" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { email } = req.params;

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const deletedUser = await prisma.user.delete({ where: { email } });

      return res.status(201).json({
        message: `User ${deletedUser.name} was deleted successfully!`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async changeStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const { email } = req.params;

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await prisma.user.update({
        where: { email },
        data: { status: status.toUpperCase() },
      });

      return res.status(201).json({
        message: `User status updated successfully to status: ${updatedUser.status}!`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
