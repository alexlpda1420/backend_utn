// src/templates/welcomeTemplate.ts

const createRegisterTemplate = (email: string) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 20px;">
          <h2 style="color: #333;">¡Bienvenido/a a la tienda!</h2>
          <p style="color: #555;">
            Hola <strong>${email}</strong>,
          </p>
          <p style="color: #555;">
            Tu registro en nuestra plataforma se ha realizado correctamente.
          </p>
          <p style="color: #555;">
            A partir de ahora vas a poder iniciar sesión, ver los productos disponibles
            y gestionar tus operaciones desde tu cuenta.
          </p>
          <p style="color: #555;">
            Si no fuiste vos quien se registró con este correo, por favor ignora este mensaje.
          </p>
          <hr/>
          <p style="font-size: 12px; color: #999;">
            Este es un mensaje automático, por favor no respondas a este correo.
          </p>
        </div>
      </body>
    </html>
  `
}

export default createRegisterTemplate
