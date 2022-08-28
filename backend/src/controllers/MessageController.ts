import { Request, Response } from "express";
import { prisma } from "../database/prismaClient";
import * as Yup from "yup";

export class MessageController {
  static async createMessage(req: Request, res: Response) {
    try {
      let schema = Yup.object().shape({
        content: Yup.string().required().min(3),
        chatId: Yup.string().required(),
      });

      try {
        await schema.validate(req.body);
      } catch (err: any) {
        console.log(err);
        return res.status(400).json({ error: err });
      }

      const { chatId, content } = req.body;

      const chat = await prisma.chat.findUnique({ where: { id: chatId } });

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      const createdMessage = await prisma.message.create({
        data: {
          chatId: chatId,
          userId: req.currentUser.id,
          text: content,
        },
      });

      return res.status(200).json(createdMessage);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getMessage(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const message = await prisma.message.findUnique({ where: { id } });

      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      return res.json(message);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async listMessages(req: Request, res: Response) {
    try {
      let schema = Yup.object().shape({
        chatId: Yup.string().required(),
        userId: Yup.string(),
      });

      try {
        await schema.validate(req.query);
      } catch (err: any) {
        console.log(err);
        return res.status(400).json({ error: err });
      }

      const { userId, chatId } = req.query;

      const chat = await prisma.chat.findUnique({
        where: { id: chatId as string },
      });

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      const messages = await prisma.message.findMany({
        where: {
          userId: userId as string,
          chatId: chatId as string,
        },
      });

      return res.json(messages);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateMessage(req: Request, res: Response) {
    try {
      const id = req.params.id;

      let schema = Yup.object().shape({
        content: Yup.string().required().min(3),
      });

      try {
        await schema.validate(req.body);
      } catch (err: any) {
        console.log(err);
        return res.status(400).json({ error: err });
      }

      const message = await prisma.message.findUnique({ where: { id } });

      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      if (message.userId !== req.currentUser.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updatedMessage = await prisma.message.update({
        where: { id },
        data: {
          text: req.body.content,
        },
      });

      return res.json(updatedMessage);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async deleteMessage(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const message = await prisma.message.findUnique({ where: { id } });

      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      if (message.userId !== req.currentUser.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const deletedMessage = await prisma.message.delete({ where: { id } });

      return res.json({ message: `Message ${deletedMessage.id} deleted` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
