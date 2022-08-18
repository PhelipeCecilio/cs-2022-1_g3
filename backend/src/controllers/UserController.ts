import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
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

  //TODO: se der tempo criar logica para deletar ou editar um usuário.
  async updateUser() {}
  async deletUser() {}

  static async changeStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const { email } = req.params;

      const updatedUser = await prisma.user.update({
        where: { email },
        data: { status },
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
