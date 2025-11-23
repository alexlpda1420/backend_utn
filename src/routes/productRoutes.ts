// EL ROUTER VALIDA NETODOS Y RUTAS PROPIAS DE LA ENTIDAD

import { Router } from "express";
import ProductController from "../controllers/productController";

const productRouter = Router()

// TODAS LAS PETICIONES QUE LLEGAN AL PRODUCTROUTER EMPIEZAN CON
// http://localhost:3000/products

productRouter.get("/",ProductController.getAllProducts);
productRouter.get("/:id", ProductController.getProductById);
productRouter.post("/", ProductController.addProduct);
productRouter.patch("/:id", ProductController.updateProduct);
productRouter.delete("/:id", ProductController.deleteProduct);


export default productRouter