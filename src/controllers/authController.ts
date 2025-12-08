import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import User from "../model/UserModel"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { registerUserSchema, loginUserSchema } from "../validators/authValidator"

dotenv.config()
const SECRET_KEY = process.env.JWT_SECRET!

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET no está definido en el archivo .env")
}

class authController {



  static register = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      // ✅ Validar body con Zod (igual que en productos)
      const validator = registerUserSchema.safeParse(req.body)

      if (!validator.success) {
        const fieldErrors = validator.error.flatten().fieldErrors
        // Tomamos el primer mensaje de error para el frontend
        const firstError =
          Object.values(fieldErrors).flat()[0] || "Datos inválidos"

        return res.status(400).json({
          success: false,
          error: firstError,      // <-- lo que usa tu frontend en Register.jsx
          errors: fieldErrors     // <-- info extra para el TP / Postman
        })
      }

      const { email, password } = validator.data

      // Verificar si el usuario ya existe
      const user = await User.findOne({ email })
      if (user) {
        return res.status(409).json({
          success: false,
          error: "El usuario ya existe en la base de datos."
        })
      }

      // Hashear contraseña
      const hash = await bcrypt.hash(password, 10)

      const newUser = new User({ email, password: hash })
      
      await newUser.save()

      return res.status(201).json({
        success: true,
        message: "Usuario registrado correctamente"
        // podés agregar data: newUser si querés, pero tu front no lo usa
      })
    } catch (e) {
      const error = e as Error

      if (error.name === "MongoServerError") {
        return res.status(409).json({
          success: false,
          error: "Usuario ya existente en nuestra base de datos"
        })
      }

      return res.status(500).json({
        success: false,
        error: "Error interno al registrar el usuario"
      })
    }
  }

  static login = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      // ✅ Validar body con Zod
      const validator = loginUserSchema.safeParse(req.body)

      if (!validator.success) {
        const fieldErrors = validator.error.flatten().fieldErrors
        const firstError =
          Object.values(fieldErrors).flat()[0] || "Datos inválidos"

        return res.status(400).json({
          success: false,
          error: firstError,      // <-- lo que usa tu frontend en Login.jsx
          errors: fieldErrors
        })
      }

      const { email, password } = validator.data

      // Buscar usuario
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "No autorizado"
        })
      }

      // Comparar contraseña
      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: "No autorizado"
        })
      }

      // Generar token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        SECRET_KEY,
        { expiresIn: "1h" }
      )

      return res.json({
        success: true,
        token // <-- lo que usa tu frontend en Login.jsx
      })
    } catch (e) {
      const error = e as Error
      
      res.status(500).json({ success: false, error: "Error al iniciar sesion" })

    }
  }
}

export default authController