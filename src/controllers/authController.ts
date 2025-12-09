import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import User from "../model/UserModel"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { registerUserSchema, loginUserSchema } from "../validators/authValidator"
import resend from "../config/emailConfig"                  // 👈 antes era transporter
import createRegisterTemplate from "../templates/registerTemplate"

dotenv.config()
const SECRET_KEY = process.env.JWT_SECRET!

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET no está definido en el archivo .env")
}

class authController {
  static register = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const validator = registerUserSchema.safeParse(req.body)

      if (!validator.success) {
        const fieldErrors = validator.error.flatten().fieldErrors

        const firstError =
          Object.values(fieldErrors).flat()[0] || "Datos inválidos"

        return res.status(400).json({
          success: false,
          error: firstError,
          errors: fieldErrors
        })
      }

      const { email, password } = validator.data

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

      // ===== Envío de mail de bienvenida con Resend =====
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM as string,            // "Tienda UTN <onboarding@resend.dev>"
          to: email,                                          // se lo mandamos al usuario registrado
          subject: "Bienvenido a la tienda UTN",
          html: createRegisterTemplate(email)
        })
      } catch (e) {
        console.error("Error al enviar el correo de bienvenida", e)
        // NO rompemos el flujo si falla el mail
      }

      return res.status(201).json({
        success: true,
        message: "Usuario registrado correctamente"
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
      const validator = loginUserSchema.safeParse(req.body)

      if (!validator.success) {
        const fieldErrors = validator.error.flatten().fieldErrors
        const firstError =
          Object.values(fieldErrors).flat()[0] || "Datos inválidos"

        return res.status(400).json({
          success: false,
          error: firstError,
          errors: fieldErrors
        })
      }

      const { email, password } = validator.data

      const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "No autorizado"
        })
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: "No autorizado"
        })
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        SECRET_KEY,
        { expiresIn: "1h" }
      )

      return res.json({
        success: true,
        token
      })
    } catch (e) {
      const error = e as Error

      if (error.name === "MongoServerError") {
        return res.status(409).json({
          success: false,
          error: "Usuario no existe en la base de datos"
        })
      }

      return res.status(500).json({
        success: false,
        error: "Error al iniciar session"
      })
    }
  }
}

export default authController
