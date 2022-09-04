import express from "express";
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";
import { ChatController } from "../controllers/ChatController";
import { MessageController } from "../controllers/MessageController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const routes = express.Router();

routes.post("/signup", UserController.store);
routes.post("/login", AuthController.store);

// All routes below require authentication
routes.use(AuthMiddleware.isAuthenticated);

routes.get("/users/:email", UserController.show);
routes.put("/users/:email", UserController.update);

routes.post("/chats", ChatController.store);
routes.get("/chats/:id", ChatController.show);
routes.get("/chats", ChatController.index);
routes.put("/chats/:id", ChatController.update);
routes.delete("/chats/:id", ChatController.delete);

routes.post("/messages", MessageController.store);
routes.get("/messages/:id", MessageController.show);
routes.get("/messages", MessageController.index);
routes.put("/messages/:id", MessageController.update);
routes.delete("/messages/:id", MessageController.delete);

// All routes bellow require to be admin
routes.use(AuthMiddleware.isAdmin);

routes.get("/users", UserController.index);
routes.delete("/users/:email", AuthMiddleware.isAdmin, UserController.delete);

export default routes;
