// EL ROUTER VALIDA NETODOS Y RUTAS PROPIAS DE LA ENTIDAD

import { Router } from "express";
import ProductController from "../controllers/productController";
import authMiddleware from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const productRouter = Router()

// TODAS LAS PETICIONES QUE LLEGAN AL PRODUCTROUTER EMPIEZAN CON
// http://localhost:3000/products

productRouter.get("/",ProductController.getAllProducts);
productRouter.get("/:id", ProductController.getProductById);
productRouter.post("/", authMiddleware, upload.single("image"), ProductController.addProduct);
productRouter.patch("/:id",authMiddleware, ProductController.updateProduct);
productRouter.delete("/:id",authMiddleware, ProductController.deleteProduct);


export default productRouter