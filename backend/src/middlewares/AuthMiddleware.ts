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

      next();
    } catch (error) {
      next(error);
      console.log(error);

      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
