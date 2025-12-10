import { Request, Response } from "express"
import resend from "../config/emailConfig"
import createTemplate from "../templates/emailTemplate"

const emailService = async (req: Request, res: Response) => {
  const { subject, email: emailUser, message } = req.body

  if (!subject || !emailUser || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Data invalida" })
  }

  try {
    const info = await resend.emails.send({
      // FROM: el remitente que tengas configurado en Resend
      from:
        process.env.RESEND_FROM ||
        "ShopLink <no-reply@tu-dominio.com>",
      // TO: sigue siendo el correo donde querés recibir los mensajes del sitio
      to: process.env.EMAIL_USER as string,
      subject,
      html: createTemplate(emailUser, message),
      replyTo: emailUser // opcional, para poder responder directo al usuario
    })

    return res.json({
      success: true, // 👈 ojo, corregimos el typo "succes"
      message: "Correo fue enviado exitosamente",
      info
    })
  } catch (e) {
    const error = e as Error
    return res
      .status(500)
      .json({ success: false, error: error.message })
  }
}

export default emailService