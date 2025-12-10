# 🧠 ShopLink Backend – API REST en TypeScript

> API REST desarrollada en **Node.js + Express + TypeScript + MongoDB**, como parte del  
> **Trabajo Práctico: _Desarrollo y Deploy de una API REST en TypeScript_ (UTN)**.

Este README documenta **exclusivamente el backend** del proyecto **ShopLink**:
estructura, tecnologías, endpoints, configuración, deploy y relación con la consigna.

---

## 👤 Datos del Autor

- **Nombre:** Alexis Esteban Roldan  
- **Proyecto:** ShopLink – Backend (API REST en TypeScript)  
- **Rol:** Estudiante de Desarrollo Full Stack 
- **Email de contacto:** a.eroldan@hotmail.com
- **GitHub:** [@alexlpda1420](https://github.com/alexlpda1420)  
- **LinkedIn:** [Alexis Esteban Roldan](https://www.linkedin.com/in/alexis-esteban-roldan/)

---

## 🎓 Contexto del Trabajo Práctico

Este backend nace como resolución del **Trabajo Práctico integrador** de la materia
**Desarrollo Full Stack**, cuyo objetivo es:

- Implementar una **API RESTful** tipada con **TypeScript**.
- Aplicar **arquitectura MVC** (Model–View–Controller).
- Integrar una **base de datos MongoDB** con modelos y validaciones.
- Implementar:
  - Autenticación y autorización vía **JWT**.
  - Validación de inputs (body, params, query) con **Zod**.
  - Subida de archivos (imágenes) con **Multer**.
  - Envío de correos con **Resend** (reemplazando Nodemailer para funcionar en Render).
  - Logger, rate limiting y manejo de errores.
- Desplegar el backend en **Render** y dejarlo consumible por el frontend (Vercel).

---

## 🧰 Stack Tecnológico

### 🧱 Core

- 🟦 **Node.js**
- 🚂 **Express**
- 💙 **TypeScript**
- 🍃 **MongoDB + Mongoose**

### 🔐 Seguridad y Auth

- 🔑 **JWT** para autenticación y protección de rutas.
- 🧂 **bcryptjs** para hash de contraseñas.
- 🧱 **express-rate-limit** para limitar intentos (ej. login/register).

### ✅ Validaciones

- 📏 **Zod** para validar:
  - Cuerpo (`req.body`)
  - Parámetros (`req.params`)
  - Query strings (`req.query`)

### 📦 Archivos y Email

- 📸 **Multer** para subida de imágenes de productos.
- ✉️ **Resend** para envío de correos:
  - Correo de contacto desde el formulario del frontend.
  - Correo de bienvenida al registrar un usuario.
- 🧩 Templates HTML para emails.

### 📝 Logging y utilidades

- 📄 **morgan** (o logger personalizado) para logs HTTP.
- 🌱 **dotenv** para variables de entorno.
- 🧹 Manejo centralizado de errores y respuestas JSON consistentes.

---

## 🗂️ Estructura del Proyecto

```bash
BACKEND-UTN/
├─ dist/                     # Código compilado (JS) para producción
├─ logs/                     # Logs de la aplicación / HTTP
├─ node_modules/
├─ uploads/                  # Imágenes de productos almacenadas en el servidor
├─ src/
│  ├─ config/
│  │  ├─ emailConfig.ts      # Configuración de Resend (antes Nodemailer)
│  │  ├─ logger.ts           # Logger (morgan / winston)
│  │  └─ mongodb.ts          # Conexión a MongoDB
│  ├─ controllers/
│  │  ├─ authController.ts   # Registro, login y JWT
│  │  └─ productController.ts# CRUD de productos + filtros + uploads
│  ├─ interfaces/
│  │  ├─ IProduct.ts         # Interface TS para productos
│  │  ├─ IUser.ts            # Interface TS para usuarios
│  │  └─ IUserTokenPayload.ts# Payload de JWT tipado
│  ├─ middleware/
│  │  ├─ authMiddleware.ts   # Verificación de token JWT
│  │  ├─ rateLimitMiddleware.ts # Limitador de requests
│  │  └─ uploadMiddleware.ts # Configuración de Multer
│  ├─ model/
│  │  ├─ ProductModel.ts     # Esquema y modelo de producto
│  │  └─ UserModel.ts        # Esquema y modelo de usuario
│  ├─ routes/
│  │  ├─ authRouter.ts       # Rutas /auth
│  │  └─ productRoutes.ts    # Rutas /products
│  ├─ services/
│  │  └─ emailService.ts     # Lógica de envío de correo de contacto
│  ├─ templates/
│  │  ├─ emailTemplate.ts    # Template HTML para contacto
│  │  └─ registerTemplate.ts # Template HTML para registro de usuario
│  ├─ types/
│  │  └─ express/
│  │     └─ index.d.ts       # Augment de tipos para Express (ej. req.user)
│  ├─ validators/
│  │  ├─ productValidator.ts # Validación de productos con Zod
│  │  └─ authValidator.ts    # Validación de login/registro con Zod
│  └─ index.ts               # Punto de entrada de la app Express
├─ .env
├─ .env.example
├─ .gitignore
├─ package-lock.json
├─ package.json
└─ tsconfig.json
```

---

## 🚀 Scripts (package.json)

Ejemplo de scripts configurados para desarrollo y producción:

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts"
  }
}
```

### ▶️ Desarrollo

```bash
npm install
npm run dev
```

El servidor se levanta en (por ejemplo):

```text
http://localhost:3000
```

### 📦 Build + Producción local

```bash
npm run build
npm start
```

---

## 🧩 Variables de Entorno

Archivo `.env` (no se commitea). El proyecto incluye `.env.example` de referencia.

Ejemplo:

```bash
PORT=3000

# Base de datos
MONGODB_URI=mongodb+srv://usuario:password@cluster/mi-db

# JWT
JWT_SECRET=super_clave_secreta

# Resend (emails)
RESEND_API_KEY=tu_api_key_resend
RESEND_FROM="ShopLink <no-reply@tudominio.com>"
EMAIL_USER=tu_correo_destino@loquesea.com

# Otros (opcional)
CLIENT_URL=https://frontend-utn-jade.vercel.app
```

> 🔐 **Importante:** `JWT_SECRET` debe ser fuerte y no compartirse.  
> `RESEND_FROM` debe usar un remitente/domino validado en Resend.

---

## 🌐 Base URL en Producción

El backend se encuentra desplegado en **Render**:

```text
https://backend-utn-1gp5.onrender.com/
```

Ejemplos:

- `GET https://backend-utn-1gp5.onrender.com/products`
- `POST https://backend-utn-1gp5.onrender.com/auth/register`
- `POST https://backend-utn-1gp5.onrender.com/auth/login`

---

## 📦 Endpoints Principales

### 👤 Autenticación (`/auth`)

#### `POST /auth/register`

Registra un nuevo usuario.

- **Body (JSON):**

```json
{
  "email": "usuario@example.com",
  "password": "contraseñaSegura123"
}
```

- **Validación con Zod (`registerUserSchema`):**
  - Email con formato correcto.
  - Contraseña con longitud mínima.

- **Lógica:**
  - Verifica si el usuario ya existe.
  - Hashea la contraseña con `bcrypt`.
  - Guarda el usuario en MongoDB.
  - Envía correo de bienvenida usando Resend + `registerTemplate`.
  - Responde con:

```json
{
  "success": true,
  "message": "Usuario registrado correctamente"
}
```

---

#### `POST /auth/login`

Inicia sesión y devuelve un JWT.

- **Body (JSON):**

```json
{
  "email": "usuario@example.com",
  "password": "contraseñaSegura123"
}
```

- **Validación con Zod (`loginUserSchema`).**
- Verifica usuario y contraseña.
- Genera un token JWT con payload:

```ts
{
  id: user._id,
  email: user.email
}
```

- **Respuesta:**

```json
{
  "success": true,
  "token": "jwt.aquí..."
}
```

---

### 🔐 Middleware de Auth

En `authMiddleware.ts`:

- Lee el header `Authorization: Bearer <token>`.
- Verifica el JWT con `JWT_SECRET`.
- Adjunta el usuario decodificado a `req.user`.
- Si el token es inválido o no existe → `401 Unauthorized`.

Se aplica a rutas que deben estar protegidas (ej: crear/editar/borrar productos).

---

### 📦 Productos (`/products`)

#### `GET /products`

Obtiene el listado de productos con filtros por **query params** (filtro en DB, no en memoria).

- **Query params soportados (ejemplos):**

```text
/products?category=software
/products?minPrice=100&maxPrice=500
/products?name=office
/products?stock=10
```

- `category`: filtro por categoría exacta.
- `name`: búsqueda parcial (ej. regex / like).
- `minPrice` y `maxPrice`: rango de precios.
- `stock`: opcional, permite filtrar por stock mínimo.

La lógica de filtrado se implementa **directamente en la consulta a MongoDB** usando Mongoose (no sobre un array en memoria).

---

#### `POST /products` _(protegido + upload)_

Crea un nuevo producto.

- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Body (FormData):**
  - `name`: string
  - `description`: string
  - `price`: number
  - `stock`: number
  - `category`: string
  - `image`: archivo (opcional)

- **Middleware:**
  - `uploadMiddleware` para procesar `image` con Multer.
  - `productValidator` (Zod) para validar datos.

- **Almacenamiento:**
  - El archivo se guarda en `/uploads`.
  - En el documento de producto se guarda la ruta del archivo, por ej.:
    - `"image": "uploads/123456789-mi-imagen.png"`

---

#### `PUT /products/:id` _(protegido)_

Actualiza un producto existente.

- Permite actualizar campos individuales.
- Puede permitir actualizar la imagen (según implementación).
- Valida datos con Zod (`updatedProductSchema`).

---

#### `DELETE /products/:id` _(protegido)_

Elimina un producto.

- Puede ser eliminación lógica o física según el modelo.
- Protegido por JWT.

---

### ✉️ Correo de contacto (`/email/send`)

#### `POST /email/send`

Envía un correo desde el formulario de contacto del frontend.

- **Body (JSON):**

```json
{
  "subject": "Consulta sobre ShopLink",
  "email": "usuario@example.com",
  "message": "Hola, quisiera hacer una consulta sobre..."
}
```

- **Lógica (`emailService.ts`):**
  - Valida que `subject`, `email` y `message` existan.
  - Construye un HTML con `emailTemplate`.
  - Usa el cliente de **Resend** (configurado en `emailConfig.ts`) para enviar:
    - `from`: `RESEND_FROM`
    - `to`: `EMAIL_USER` (tu mail de recepción)
    - `cc`: opcionalmente el mail del usuario, según configuración.
  - Responde con:

```json
{
  "success": true,
  "message": "Correo fue enviado exitosamente"
}
```

---

## 📥 Subida de archivos (Multer)

Configurada en `uploadMiddleware.ts`:

- Define:
  - Carpeta destino: `uploads/`
  - Nombre de archivo: timestamp + identificador.
- Solo se aceptan ciertos tipos MIME (ej: `image/png`, `image/jpeg`).
- Se expone la carpeta `uploads` como estática desde `index.ts`:

```ts
app.use("/uploads", express.static("uploads"))
```

Esto permite que el frontend consuma imágenes con URLs como:

```text
https://backend-utn-1gp5.onrender.com/uploads/archivo.png
```

---

## 📏 Validaciones con Zod

En `validators/`:

### `productValidator.ts`

- `createProductSchema`:
  - `name`: string, min 4 caracteres.
  - `description`: string, min 10.
  - `price`: number, min 10.
  - `category`: string, min 2.
  - `stock`: number, positivo.
  - `image`: string opcional (si viene ruta) o default.

- `updatedProductSchema`:
  - Versión `partial()` para updates (todos los campos opcionales).

### `authValidator.ts`

- `registerUserSchema`:
  - `email`: string, formato email.
  - `password`: string, longitud mínima.

- `loginUserSchema`:
  - `email`: string, formato email.
  - `password`: string.

En los controllers (`authController`, `productController`) se usa:

```ts
const result = schema.safeParse(req.body)
if (!result.success) {
  // devolver 400 con el primer error de Zod
}
```

---

## 🔒 Rate Limiting

En `rateLimitMiddleware.ts`:

- Se configura un límite de requests por IP para ciertas rutas, por ejemplo:

  - `/auth/login`
  - `/auth/register`

- Previene abuso/brute force en autentificación.
- Responde con `429 Too Many Requests` si se supera el límite.

---

## 📜 Logger

- Uso de `morgan` (u otro logger definido en `logger.ts`) para:
  - Registrar método HTTP, ruta, status code y tiempo de respuesta.
- Logs almacenados en la carpeta `logs/` (según configuración).

---

## ☁️ Deploy en Render

Pasos generales:

1. Subir el código a un repositorio GitHub.
2. Crear un nuevo servicio web en Render apuntando al repo.
3. Configurar:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - Variables de entorno (`.env` → Render Dashboard).
4. Habilitar “Auto Deploy” si se desea.

El servicio expone la API en:

```text
https://backend-utn-1gp5.onrender.com/
```

---

## ✅ Relación con la consigna

Este backend cumple con los puntos clave del trabajo práctico:

- ✅ **Node.js + Express + TypeScript**  
- ✅ **Patrón MVC** (controllers, models, routes, middleware, services)  
- ✅ **Base de datos MongoDB** con modelos y esquemas tipados  
- ✅ **Autenticación con JWT** y protección de rutas  
- ✅ **Validación de inputs con Zod** (body, params, query)  
- ✅ **Filtros por query params en DB** (no en memoria)  
- ✅ **Subida de archivos con Multer** y exposición estática  
- ✅ **Envío de correos** (Resend, templates HTML)  
- ✅ **Logger + rate limiting**  
- ✅ **Deploy en Render** y consumo real por un frontend en Vercel  

---

## 🚀 Posibles mejoras futuras

- Roles de usuario (admin / user) con permisos diferenciados.
- Soft delete de productos y recuperación.
- Paginación y ordenamiento de resultados en `/products`.
- Endpoint de métricas (ej. cantidad de productos, categorías, etc.).
- Tests unitarios y de integración (Jest, Supertest).
- Documentación interactiva con Swagger / OpenAPI.

---

## 🙌 Cierre

Este backend es el corazón técnico de **ShopLink**.  
Integra buenas prácticas de desarrollo backend moderno con TypeScript, seguridad básica, validaciones, manejo de archivos y deploy en la nube.

Si te sirve como referencia para tus propios proyectos, estudios o para mostrar en entrevistas, misión cumplida. 💻🚀
