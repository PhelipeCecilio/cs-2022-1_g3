import { Request, Response } from "express";

import { prisma } from "../database/prismaClient";

import * as Yup from "yup";

export class ChatController {
  static async createChat(req: Request, res: Response) {
    //@ts-ignore
    console.log(req.currentUser);

    let schema = Yup.object().shape({
      name: Yup.string().required().min(3),
    });

    try {
      await schema.validate(req.body);
    } catch (err: any) {
      console.log(err);
      return res.status(400).json({ error: err });
    }

    const { name } = req.body;

    const foundChat = await prisma.chat.findUnique({
      where: { name },
    });

    if (foundChat) {
      return res.status(400).json({ error: "Chat already exists" });
    }

    try {
      const chat = await prisma.chat.create({
        //@ts-ignore
        data: { name, userId: req.currentUser.id },
      });

      return res.json({ chat });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getChat(req: Request, res: Response) {
    const id = req.params.id;
    try {
      let chat = await prisma.chat.findUnique({ where: { id } });
      const message = await prisma.message.findMany({
        where: {
          chatId: id,
        },
      });
      if (chat) {
        chat["messages"] = message;
        return res.json(chat);
      }
      res.status(404).json({ message: "Chat not found" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async listChats(req: Request, res: Response) {
    const userId = req.query.userId as string | undefined;

    try {
      const chats = await prisma.chat.findMany({
        where: {
          userId,
        },
      });
      return res.json(chats);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateChat(req: Request, res: Response) {
    const id = req.params.id;

    try {
      let chat = await prisma.chat.findUnique({ where: { id } });
      if (!chat) {
        return res.json({ message: "Chat not found" });
      }
      chat = await prisma.chat.update({ where: { id }, data: req.body });
      return res.json(chat);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async deleteChat(req: Request, res: Response) {
    try {
      const id = req.params.id;
      let chat = await prisma.chat.findUnique({ where: { id } });
      if (!chat) {
        return res.json({ message: "Chat not found" });
      }
      chat = await prisma.chat.delete({ where: { id } });
      return res.json(chat);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
