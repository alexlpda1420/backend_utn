import { z } from "zod"

export const registerUserSchema = z.object({
  email: z.string().email("El correo electrónico no es valido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6")
})

export const loginUserSchema = z.object({
  email: z.string().email("El correo electrónico no es valido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6")
})

