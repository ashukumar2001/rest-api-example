import { Router } from "express";
import registerController from "../controllers/register.controller.js";
const router = Router();
router.post("/register", registerController.register);
export default router;
