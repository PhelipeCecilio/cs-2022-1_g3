import { Request, Response } from "express";
import { prisma } from "../database/prismaClient";
import * as Yup from "yup";

import bcrypt from "bcrypt";

export class UserController {
  static async store(req: Request, res: Response) {
    try {
      let bodySchema = Yup.object().shape({
        name: Yup.string().required().min(3),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6),
      });

      try {
        await bodySchema.validate(req.body);
      } catch (err: any) {
        console.log(err);
        return res.status(400).json({ error: err });
      }

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

  static async index(req: Request, res: Response) {
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

  static async show(req: Request, res: Response) {
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

  static async update(req: Request, res: Response) {
    try {
      let bodySchema = Yup.object().shape({
        name: Yup.string().min(3),
        currentPassword: Yup.string().required().min(6),
        newPassword: Yup.string().oneOf(
          [Yup.ref("currentPassword"), null],
          "Passwords must match"
        ),
        status: Yup.string().required(),
      });

      let querySchema = Yup.object().shape({
        email: Yup.string().email(),
      });

      try {
        await bodySchema.validate(req.body);
        await querySchema.validate(req.query);
      } catch (err: any) {
        console.log(err);

        return res.status(400).json({ error: err });
      }

      const { email } = req.params;
      const { name, currentPassword, newPassword, status } = req.body;

      if (
        (name && currentPassword && newPassword && status) ||
        (name && currentPassword && newPassword)
      ) {
        return res.status(400).json({
          message: "You can't update multiple data at the same time",
        });
      }

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.id !== req.currentUser.id) {
        if (req.currentUser.role !== "ADMIN") {
          return res
            .status(401)
            .json({ message: "You can't update other user's data" });
        }
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

      if (status) {
        const updatedUser = await prisma.user.update({
          where: { email },
          data: { status },
        });

        return res.status(201).json({
          message: `User ${updatedUser.name} name was updated successfully!`,
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

  static async delete(req: Request, res: Response) {
    try {
      if (req.currentUser.role !== "ADMIN") {
        return res.status(401).json({ message: "You can't delete users" });
      }

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
}
