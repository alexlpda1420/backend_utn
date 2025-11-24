
// LEVANTAR NUESTRO SERVICIO Y CONFIGURACIONES GLOBALES

import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/mongodb"
import productRouter from "./routes/productRoutes";
import authRouter from "./routes/authRouter";
import morgan from "morgan"
import logger from "./config/logger";
import limiter from "./middleware/rateLimitMiddleware";
import authMiddleware from "./middleware/authMiddleware";
// import IUserTokenPayload from "./interfaces/IUserTokerPayload";
import dotenv from "dotenv"
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
app.use("/auth",limiter, authRouter)

// ENDPOINT - Login de usuario
app.use("/auth",limiter, authRouter)

// ENDPOINT - Productos
app.use("/products", productRouter)

// Endpoiunt para el 404 - No se encuentra el recurso
app.use("", (_: Request, res: Response): void => {
  res.status(404).json({ success: false,
    error: "El recurso no se encuentra"
  })
})
// Servidor en escucha
app.listen(PORT, () => {
  connectDB()
  console.log(`Servidor en escucha en el puerto http://localhost:${PORT}`);
});
