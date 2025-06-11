// userRoutes.post("/login", controller.authentication);

// userRoutes.get("/", auth, controller.listUsers);
// userRoutes.get("/", controller.listUsers);
// userRoutes.put("/:id", auth, controller.updateUser);
// userRoutes.put("/:id", controller.updateUser);
// userRoutes.delete("/:id", auth, controller.deleteUser);
// userRoutes.delete("/:id", controller.deleteUser);



import express from "express";
import controller from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/register", controller.registerUser);
userRoutes.get("/", controller.listAllUsers);
userRoutes.get("/:id", controller.listUserById);
userRoutes.put("/:id", controller.updateUser);
userRoutes.delete("/:id", controller.deleteUser);

export default userRoutes;

