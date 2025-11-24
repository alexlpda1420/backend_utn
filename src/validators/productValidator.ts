import { z } from "zod"

const productSchemaValidator = z.object({
  name: z.string().min(4),
  description: z.string().min(20),
  price: z.number().positive(),
  category: z.string().min(2),
  stock: z.number().positive()
})

export const createProductSchema = productSchemaValidator

export const updatedProductSchema = productSchemaValidator.partial()


