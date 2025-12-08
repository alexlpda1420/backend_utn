// FUNCIONES QUE SANITIZAN DATOS DE ENTRADA Y RESPONDEN AL CLIENTE
// LA REQUEST Y EL RESPONSE SIEMPRE ESTARAN EN LOS CONTROLES

import { Types } from "mongoose";
import Product from "../model/ProductModel";
import { Request, Response } from "express";
import {
  createProductSchema,
  updatedProductSchema,
} from "../validators/productValidator";

class ProductController {
  static getAllProducts = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { name, stock, category, minPrice, maxPrice } = req.query;
      const filter: any = {};
      if (name) filter.name = new RegExp(String(name), "i");
      if (stock) filter.stock = Number(stock);
      if (category) filter.category = new RegExp(String(category), "i");
      if (minPrice || maxPrice) {
        const min = minPrice ? Number(minPrice) : undefined;
        const max = maxPrice ? Number(maxPrice) : undefined;

        filter.price = {};

        if (min !== undefined && !Number.isNaN(min)) {
          filter.price.$gte = min;
        }
        if (max !== undefined && !Number.isNaN(max)) {
          filter.price.$lte = max;
        }

        // Si ninguno de los dos era válido, limpias price
        if (Object.keys(filter.price).length === 0) {
          delete filter.price;
        }
      }

      const listProducts = await Product.find(filter);
      res.json({ success: true, data: listProducts });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ success: false, error: error.message });
    }
  };

  static getProductById = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, error: "Id Invalido" });
      }

      const productFinded = await Product.findById(id);

      if (!productFinded) {
        return res
          .status(404)
          .json({ success: false, error: "Producto no encontrado" });
      }
      res.status(200).json({ success: true, data: productFinded });
    } catch (e) {
      const error = e as Error;

      res.status(500).json({ success: false, error: error.message });
    }
  };

  static addProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { body, file } = req

      const { name, description, price, category, stock } = body

      if (!name || !description || !price || !category || !stock) {
        return res.status(400).json({ message: "Todos los campos son requeridos" })
      }

      // VALIDACIONES DE INPUT
      // validar el tipo de data que recibo del front
      // 1 - si para la validación creo el producto
      // 2 - si no pasa la validación retorno una respuesta 400 al front

      const dataToValidate = {
        name,
        description,
        category,
        stock: +stock,
        price: +price,
        image: file?.path
      }

      const validator = createProductSchema.safeParse(dataToValidate)

      if (!validator.success) {
        return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
      }

      const newProduct = new Product(validator.data)

      await newProduct.save()
      res.status(201).json({ success: true, data: newProduct })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  };


  static updateProduct = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const { body } = req;

      if (!Types.ObjectId.isValid(id))
        res.status(404).json({ success: false, error: "Id Invalido" });

      const validator = updatedProductSchema.safeParse(body);

      if (!validator.success) {
        return res.status(400).json({
          success: false,
          error: validator.error.flatten().fieldErrors,
        });
      }

      const productUpdated = await Product.findByIdAndUpdate(
        id,
        validator.data,
        { new: true }
      );

      res.json({ success: true, data: productUpdated });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Error interno del servidor" });
    }
  };

  static deleteProduct = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, error: "Id Invalido" });
      }

      const productDeleted = await Product.findByIdAndDelete(id);
      if (!productDeleted) {
        return res
          .status(404)
          .json({ success: false, error: "Producto no encontrado" });
      }

      res.json({ success: true, data: productDeleted });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Error interno del servidor" });
    }
  };
}

export default ProductController;
