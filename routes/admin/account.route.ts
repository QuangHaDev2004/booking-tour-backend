import { Router } from "express";
import * as accountController from "../../controllers/admin/account.controller";

const router = Router();

router.post("/register", accountController.registerPost);

export default router;
