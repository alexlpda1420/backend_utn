import { Resend } from "resend"

const RESEND_API_KEY = process.env.RESEND_API_KEY


if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY no está definido en el archivo .env")
}

const resend = new Resend(RESEND_API_KEY)

export default resend
