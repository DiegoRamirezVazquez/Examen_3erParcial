# Backend – Examen 3er Parcial

## 1. Descripción general

El backend está desarrollado con Node.js y Express. Su función principal es gestionar la autenticación de los estudiantes, administrar las sesiones de usuario y proporcionar información académica obtenida mediante la API institucional del Sistema Integral de Información (SII) del Instituto Tecnológico de Celaya.

El backend funciona como intermediario entre el frontend, la base de datos Supabase y los servicios del SII.

### Objetivos principales

- Autenticar estudiantes mediante sus credenciales institucionales.
- Gestionar sesiones de usuario de manera segura.
- Consultar y proporcionar información académica.
- Proteger las rutas que requieren autenticación.
- Administrar la comunicación con la API institucional.
- Almacenar de manera segura los tokens de autenticación.
- Proteger las operaciones sensibles mediante mecanismos CSRF.

## 2. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| Node.js | Entorno de ejecución de JavaScript. |
| Express.js | Framework para crear el servidor y las rutas HTTP. |
| Supabase | Almacenamiento de información de sesiones. |
| PostgreSQL | Sistema de base de datos utilizado por Supabase. |
| Axios / solicitudes HTTP | Comunicación con la API institucional, según la implementación del servicio. |
| dotenv | Administración de variables de entorno. |
| Nodemon | Reinicio automático del servidor durante el desarrollo. |
| JWT | Token de autenticación proporcionado por el SII. |

## 3. Estructura del backend

La organización del proyecto se encuentra distribuida por responsabilidades:

```text
backend/
│
├── src/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── estudianteController.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── csrfMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── estudianteRoutes.js
│   │
│   ├── services/
│   │   ├── bitacoraService.js
│   │   ├── sessionService.js
│   │   └── siiService.js
│   │
│   ├── utils/
│   │   └── sessionHandler.js
│   │
│   ├── app.js
│   └── server.js
│
├── package.json
└── .env
```

## 4. Descripción de los archivos

### 4.1 Configuración

**`src/config/database.js`**

Contiene la configuración de conexión con Supabase. Permite que los servicios del backend interactúen con la base de datos donde se almacenan los datos de las sesiones.

### 4.2 Controladores

**`src/controllers/authController.js`**

Gestiona las operaciones relacionadas con la autenticación:

- Obtención del token CSRF.
- Inicio de sesión.
- Validación de credenciales institucionales.
- Creación de sesiones.
- Consulta de la sesión activa.
- Cierre de sesión.

**`src/controllers/estudianteController.js`**

Gestiona las solicitudes de información académica:

- Obtención de información general del estudiante.
- Consulta de calificaciones.
- Consulta del historial académico (Kardex).
- Consulta de horarios escolares.

Los controladores reciben las solicitudes HTTP, utilizan los servicios correspondientes y devuelven las respuestas al cliente.

### 4.3 Middlewares

**`src/middlewares/authMiddleware.js`**

Implementa la verificación de autenticación para las rutas protegidas.

Sus responsabilidades incluyen:

- Comprobar la existencia de una sesión válida.
- Recuperar la sesión del usuario.
- Obtener el token institucional almacenado de forma segura.
- Verificar que la sesión no haya expirado.
- Permitir o rechazar el acceso a las rutas protegidas.

**`src/middlewares/csrfMiddleware.js`**

Implementa la protección contra ataques Cross-Site Request Forgery (CSRF).

Se utiliza para proteger operaciones sensibles, como el inicio y cierre de sesión, mediante la validación del token CSRF.

### 4.4 Rutas

**`src/routes/authRoutes.js`**

Define los endpoints relacionados con la autenticación y administración de sesiones.

**`src/routes/estudianteRoutes.js`**

Define los endpoints utilizados para consultar la información académica del estudiante.

### 4.5 Servicios

**`src/services/siiService.js`**

Contiene la comunicación con la API institucional del SII.

Se encarga de realizar las solicitudes HTTP necesarias para obtener información del estudiante, calificaciones, Kardex y horarios.

**`src/services/sessionService.js`**

Administra las operaciones relacionadas con las sesiones almacenadas en Supabase:

- Creación de sesiones.
- Almacenamiento del token institucional cifrado.
- Recuperación de sesiones.
- Validación de vigencia.
- Eliminación de sesiones.

**`src/services/bitacoraService.js`**

Contiene la funcionalidad relacionada con el registro de eventos y operaciones del sistema.

### 4.6 Utilidades

**`src/utils/sessionHandler.js`**

Contiene funciones auxiliares relacionadas con el manejo de sesiones y cookies.

### 4.7 Archivos principales

**`src/app.js`**

Configura la aplicación Express, registra los middlewares generales y monta las rutas del sistema.

Las rutas principales se montan mediante:

- `/api/auth`
- `/api/estudiante`

**`src/server.js`**

Es el punto de entrada del backend. Se encarga de iniciar el servidor HTTP.

## 5. Endpoints del backend

La API del backend utiliza el prefijo:

```text
http://localhost:3000/api
```

### 5.1 Autenticación

Prefijo: `/api/auth`

| Método | Endpoint | Función | Protección |
|---|---|---|---|
| GET | `/api/auth/csrf` | Obtiene el token CSRF. | Sin sesión previa |
| POST | `/api/auth/login` | Inicia sesión con credenciales institucionales. | Protección CSRF |
| POST | `/api/auth/logout` | Cierra la sesión del usuario. | Protección CSRF |
| GET | `/api/auth/me` | Obtiene la información del estudiante autenticado. | Autenticación |

### 5.2 Información académica

Prefijo: `/api/estudiante`

| Método | Endpoint | Función | Protección |
|---|---|---|---|
| GET | `/api/estudiante` | Obtiene la información general del estudiante. | `verificarToken` |
| GET | `/api/estudiante/calificaciones` | Consulta las calificaciones del estudiante. | `verificarToken` |
| GET | `/api/estudiante/kardex` | Obtiene el historial académico. | `verificarToken` |
| GET | `/api/estudiante/horarios` | Consulta el horario escolar. | `verificarToken` |

**Nota:** Las rutas protegidas requieren una sesión válida. El navegador utiliza la cookie de sesión para identificarse ante el backend.

## 6. Integración con la API institucional del SII

El backend se comunica con la API institucional:

```text
https://sii.celaya.tecnm.mx/api
```

Los servicios institucionales utilizados son:

| Método | Endpoint del SII | Descripción |
|---|---|---|
| POST | `/api/login` | Autenticación institucional. |
| GET | `/api/movil/estudiante` | Información general del estudiante. |
| GET | `/api/movil/estudiante/calificaciones` | Calificaciones. |
| GET | `/api/movil/estudiante/kardex` | Historial académico. |
| GET | `/api/movil/estudiante/horarios` | Horario escolar. |

Las consultas que requieren autenticación institucional utilizan:

```http
Authorization: Bearer <JWT>
```

El token es utilizado exclusivamente por el backend para realizar solicitudes al SII.

## 7. Arquitectura de autenticación y sesiones

El proyecto utiliza una arquitectura en la que el backend actúa como intermediario entre el navegador y el SII.

### Flujo de autenticación

1. El usuario solicita un token CSRF.
2. El frontend envía las credenciales institucionales al backend.
3. El backend valida las credenciales mediante el servicio de autenticación del SII.
4. El SII devuelve un JWT.
5. El backend procesa el token y obtiene su fecha de expiración.
6. El JWT se cifra y se almacena en Supabase.
7. Se genera una sesión para el usuario.
8. El navegador recibe una cookie de sesión llamada `app_session`.

### Seguridad de las sesiones

El navegador no recibe ni almacena directamente el JWT institucional.

En su lugar, utiliza una cookie de sesión:

```text
app_session
```

Esta cookie es de tipo HttpOnly, evitando que el JavaScript del navegador pueda acceder directamente a su contenido.

### Tabla de sesiones en Supabase

La tabla `sesiones` utiliza los siguientes campos:

| Campo | Descripción |
|---|---|
| `session_hash` | Identificador de la sesión. |
| `user_id` | Identificador del usuario asociado. |
| `encrypted_token` | Token institucional almacenado cifrado. |
| `expires_at` | Fecha y hora de expiración. |
| `created_at` | Fecha de creación. |
| `updated_at` | Fecha de actualización. |

### Protección CSRF

Se utiliza un mecanismo de protección CSRF mediante:

- Cookie `csrf_token`.
- Encabezado HTTP `X-CSRF-Token`.
- Middleware `doubleCsrfProtection`.

Esto permite validar que las operaciones sensibles provengan de solicitudes que cuentan con el token CSRF correspondiente.

## 8. Flujo de comunicación del sistema

```text
             FRONTEND
                 |
                 | Solicitudes HTTP
                 v
          BACKEND EXPRESS
                 |
        +--------+--------+
        |                 |
        v                 v
  AUTH CONTROLLER   ESTUDIANTE CONTROLLER
        |                 |
        v                 v
  SESSION SERVICE     SII SERVICE
        |                 |
        v                 v
     SUPABASE         API INSTITUCIONAL
        |                 |
        v                 v
  SESIONES           INFORMACIÓN
  CIFRADAS           ACADÉMICA
```

El backend centraliza la comunicación con el SII y evita que el frontend tenga acceso directo al token institucional.

## 9. Instalación y ejecución

### Requisitos

- Node.js.
- npm.
- Proyecto de Supabase configurado.
- Credenciales de conexión.
- Acceso a la API institucional del SII.

### Instalación de dependencias

Desde el directorio `backend`:

```bash
npm install
```

### Variables de entorno

El backend utiliza un archivo `.env` para configurar sus credenciales y parámetros de conexión.

Entre los parámetros de configuración se encuentra el secreto utilizado para la protección CSRF:

```env
CSRF_SECRET=tu_secreto
```

También deben configurarse las credenciales de conexión con Supabase y los demás parámetros requeridos por los archivos de configuración.

**Importante:** El archivo `.env` no debe subirse al repositorio de GitHub, ya que contiene información sensible.

### Ejecución en desarrollo

```bash
npm run dev
```

### Ejecución normal

```bash
npm start
```

El servidor se inicia en:

```text
http://localhost:3000
```

## 10. Consideraciones de seguridad

- No exponer el JWT institucional al frontend.
- Almacenar el token institucional cifrado en Supabase.
- Utilizar cookies HttpOnly para la identificación de sesiones.
- Validar las sesiones antes de permitir el acceso a endpoints protegidos.
- Implementar protección CSRF en operaciones sensibles.
- Mantener las credenciales fuera del código fuente.
- No publicar archivos `.env` en repositorios públicos.
- Validar la expiración de las sesiones.
- Centralizar las solicitudes institucionales en el backend.

## 11. Resumen del desarrollo

El backend proporciona una capa de servicios que permite integrar la autenticación institucional del SII con una aplicación web propia.

Su estructura modular separa las responsabilidades de rutas, controladores, middlewares, servicios y configuración, facilitando el mantenimiento y la ampliación del sistema.

Actualmente, el backend contempla:

- Autenticación institucional.
- Administración de sesiones.
- Protección CSRF.
- Consulta de información del estudiante.
- Consulta de calificaciones.
- Consulta del Kardex.
- Consulta de horarios.
- Integración con Supabase.
- Comunicación con la API institucional del SII.