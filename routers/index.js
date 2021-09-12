import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  registerController,
  loginController,
  userController,
  refreshController,
} from "../controllers/index.js";
const router = Router();
router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/me", auth, userController.me);
router.post("/refresh", refreshController.refresh);
router.post("/logout", auth, loginController.logout);

export default router;
