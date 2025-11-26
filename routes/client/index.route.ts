import { Router } from "express";
import homeRoutes from "./home.route";
import contactRoutes from "./contact.route";
import categoryRoutes from "./category.route";
import cityRoutes from "./city.route";
import searchRoutes from "./search.route";

const router = Router();

router.use("/", homeRoutes);

router.use("/contact", contactRoutes);

router.use("/category", categoryRoutes);

router.use("/city", cityRoutes);

router.use("/search", searchRoutes);

export default router;
