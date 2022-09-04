import { Request, Response } from "express";
import { prisma } from "../database/prismaClient";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

export class AuthController {
  static async store(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user) {
        if (await bcrypt.compare(password, user.password)) {
          const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            {
              expiresIn: "10h",
            }
          );

          return res.json({ token });
        } else {
          return res.status(400).json({ message: "Invalid password" });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
