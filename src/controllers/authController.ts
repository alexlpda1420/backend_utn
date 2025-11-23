import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import User from "../model/UserModel"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


const SECRET_KEY = process.env.JWT_SECRET!

class authController {
  static register = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Datos Invalidos" })
      }

      // Crear el hash de la contraseña
      const hash = await bcrypt.hash(password, 10)

      const newUser = new User({ email, password: hash })

      await newUser.save()

      res.json({ success: true, data: newUser })
    } catch (e) {
      const error = e as Error
      if (error.name === "MongoServerError") {
        return res.status(409).json({ success: false, error: "Usuario ya existente en nuestra base de datos" })
      }

    }
  }

  static login = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Datos Invalidos" })
      }
      // Validar usuario
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).json({ success: false, error: "No autorizado" })
      }

      // Validar contraseña

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return res.status(401).json({ success: false, error: "No autorizado" })
      }

      // Permiso especial --> sesion de uso
      // jsonwebtoken -> jwt
      // 1- Payload -> informacion publica que quiero compartir del usuario logueado
      // 2- Clave secreta -> firma que valida el token
      // 3- Opciones -> cuando expira

      const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" })
      res.json({ success: true, token })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })

    }
  }
}

export default authController