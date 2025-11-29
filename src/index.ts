
// LEVANTAR NUESTRO SERVICIO Y CONFIGURACIONES GLOBALES

import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/mongodb"
import productRouter from "./routes/productRoutes";
import authRouter from "./routes/authRouter";
import morgan from "morgan"
import logger from "./config/logger";
import limiter from "./middleware/rateLimitMiddleware";
// import authMiddleware from "./middleware/authMiddleware";
// import IUserTokenPayload from "./interfaces/IUserTokenPayload";
import dotenv from "dotenv"
import { success } from "zod";
import transporter from "./config/emailConfig";
import createTemplate from "./templates/emailTemplate";
dotenv.config()



// declare global {
//   namespace Express {
//     interface Request {
//       user?: IUserTokenPayload
//     }
//   }
// }
// Credenciales
const PORT = process.env.PORT!
// Creacion del servidor
// Habilitando cors -> el front pueda consumir la API
// Habilitando el req.body -> el front pueda enviar un json al servidor
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"))
app.use(logger)


// ENDPOINT para comunicar el estado interno de la API
app.get("/", (_: Request, res: Response) => {
  res.json({ status: true });
});
// ENDPOINT - Registro de usuario
app.use("/auth", limiter, authRouter)

// ENDPOINT - Login de usuario
app.use("/auth", limiter, authRouter)

// ENDPOINT - Productos
app.use("/products", productRouter)

// Enviar correo electrónico
app.post("/email/send", async (req, res) => {
  const { subject, email: emailUser, message } = req.body

  if (!subject || !emailUser
    || !message) {
    return res.status(400).json({ success: false, message: "Data Invalida" })
  }

  try {
    const info = await transporter.sendMail({
      from: `Mensaje de la tienda: ${emailUser}`,
      to: process.env.EMAIL_USER,
      subject,
      html: createTemplate(emailUser, message)
    })

   res.json({ succes: true, message: "Correo fue enviado exitosamente", info })

  } catch (e) {
    const error = e as Error
    res.status(500).json({ success: false, error: error.message })
  }
})

// Endpoiunt para el 404 - No se encuentra el recurso
app.use("", (_: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: "El recurso no se encuentra"
  })
})

// Servidor en escucha
app.listen(PORT, () => {
  connectDB()
  console.log(`Servidor en escucha en el puerto http://localhost:${PORT}`);
});
