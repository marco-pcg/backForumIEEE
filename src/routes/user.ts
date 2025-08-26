import { Router } from "express";
import UserController from "../controllers/UserController.ts";

const router = Router()

router.get('/', UserController.findAllUsers)

export default router