import { prisma } from "../database/prismaClient";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export class AuthMiddleware {
  static async isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }

      const parsedToken = token.split(" ")[1];

      const decoded = jwt.verify(parsedToken, process.env.JWT_SECRET as string);

      if (!decoded) {
        return res.json({ message: "Invalid token" });
      }

      const userId = typeof decoded === "object" ? decoded.userId : null;

      if (!userId) {
        return res.status(400).json({ message: "Invalid token" });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        return res.status(400).json({ message: "Invalid user" });
      }

      //@ts-ignore
      req.currentUser = user;

      //@ts-ignore
      if (!req.currentUser) {
        return res.status(400).json({ message: "Invalid current user" });
      }

      next();
    } catch (error) {
      next(error);
      console.log(error);

      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token expired" });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid token" });
      }

      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }

      const parsedToken = token.split(" ")[1];

      const decoded = jwt.verify(parsedToken, process.env.JWT_SECRET as string);

      if (!decoded) {
        return res.status(400).json({ message: "Invalid token" });
      }

      const userId = typeof decoded === "object" ? decoded.userId : null;

      if (!userId) {
        return res.status(400).json({ message: "Invalid token" });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        return res.status(400).json({ message: "Invalid user" });
      }

      if (user?.role !== "ADMIN") {
        return res.status(401).json({
          message: "Operation not allowed! Only admins can perform that.",
        });
      }

      req.user = user;

      next();
    } catch (error) {
      next(error);
      console.log(error);

      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token expired" });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid token" });
      }

      return res.status(500).json({ message: "Unable to verify token" });
    }
  }
}
