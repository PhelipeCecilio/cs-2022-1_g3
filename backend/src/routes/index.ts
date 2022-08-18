import express from "express";
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";
import { ChatController } from "../controllers/ChatController";
import { MessageController } from "../controllers/MessageController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const routes = express.Router();

routes.post("/login", AuthController.login);

routes.post("/signup", UserController.createUser);
routes.get("/users/:email", UserController.getUser);
routes.get("/users", UserController.listUsers);

// All routes below require authentication
routes.use(AuthMiddleware.isAuthenticated);

routes.put("/users/:email/status", UserController.changeStatus);
routes.post("/chat", ChatController.createChat);
routes.get("/chat/:id", ChatController.getChat);
routes.get("/chats", ChatController.listChats);
routes.put("/chat/:id", ChatController.updateChat);
routes.delete("/chat/:id", ChatController.deleteChat);

routes.post("/message", MessageController.createMessage);
routes.get("/message/:id", MessageController.getMessage);
routes.get("/messages", MessageController.listMessages);
routes.put("/message/:id", MessageController.updateMessage);
routes.delete("/message/:id", MessageController.deleteMessage);

export default routes;
