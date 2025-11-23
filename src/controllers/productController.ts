// FUNCIONES QUE SANITIZAN DATOS DE ENTRADA Y RESPONDEN AL CLIENTE
// LA REQUEST Y EL RESPONSE SIEMPRE ESTARAN EN LOS CONTROLES

import { Types } from "mongoose";
import Product from "../model/ProductModel";
import { Request, Response } from "express";


class ProductController {
  static getAllProducts = async (req: Request, res: Response): Promise<void | Response> => {

  try {

    const listProducts = await Product.find()
    res.json({ success: true, data: listProducts });
  } catch (e) {
    const error = e as Error
    res.status(500).json({ success: false, error: error.message })

  }
}

static getProductById = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, error: "Id Invalido" })

    }


    const productFinded = await Product.findById(id)

    if (!productFinded) {
      return res.status(404).json({ success: false, error: "Producto no encontrado" });
    }
    res.status(200).json({ success: true, data: productFinded });

  } catch (e) {
    const error = e as Error

    res.status(500).json({ success: false, error: error.message })
  }
}

static addProduct = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { body } = req;

    const { name, description, price, category, stock } = body;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ success: false, message: "Datos Invalidos" });
    }

    const newProduct = new Product(
      {
        name,
        description,
        stock,
        category,
        price
      }
    )

    await newProduct.save()


    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error interno del servidor" })
  }
}

static updateProduct = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const { body } = req;

    if (!Types.ObjectId.isValid(id)) res.status(404).json({ success: false, error: "Id Invalido" })

    const { name, stock, description, price, category } = body;
    const updates = { name, stock, description, price, category }

    const productUpdated = await Product.findByIdAndUpdate(id, updates, { new: true })

    res.json({ success: true, data: productUpdated });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error interno del servidor" })
  }
}

static deleteProduct = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, error: "Id Invalido" })

    }

    const productDeleted = await Product.findByIdAndDelete(id)
    if (!productDeleted) {
      return res.status(404).json({success: false, error: "Producto no encontrado"})
    }

    res.json({success: true, data: productDeleted});
  } catch (error) {
    res.status(500).json({success: false, error: "Error interno del servidor" })

  }
}

}


export default ProductController