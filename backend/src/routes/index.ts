import express from "express";
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";
import { ChatController } from "../controllers/ChatController";
import { MessageController } from "../controllers/MessageController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const routes = express.Router();

routes.post("/signup", UserController.createUser);
routes.post("/login", AuthController.login);

// All routes below require authentication
routes.use(AuthMiddleware.isAuthenticated);

routes.get("/users/:email", UserController.getUser);
routes.put("/users/:email/status", UserController.changeStatus);

routes.post("/chats", ChatController.createChat);
routes.get("/chats/:id", ChatController.getChat);
routes.get("/chats", ChatController.listChats);
routes.put("/chats/:id", ChatController.updateChat);
routes.delete("/chats/:id", ChatController.deleteChat);

routes.post("/messages", MessageController.createMessage);
routes.get("/messages/:id", MessageController.getMessage);
routes.get("/messages", MessageController.listMessages);
routes.put("/messages/:id", MessageController.updateMessage);
routes.delete("/messages/:id", MessageController.deleteMessage);

// All routes bellow require to be admin
routes.use(AuthMiddleware.isAdmin);

routes.get("/users", UserController.listUsers);
routes.delete(
  "/users/:email",
  AuthMiddleware.isAdmin,
  UserController.deleteUser
);

export default routes;
