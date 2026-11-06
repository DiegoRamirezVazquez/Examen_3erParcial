# Portal Académico – Instituto Tecnológico de Celaya

## 1. Descripción general

Portal Académico es una aplicación web desarrollada para facilitar el acceso de los estudiantes a su información académica y ofrecer un espacio de interacción mediante una Comunidad Estudiantil.

El sistema permite:

- Autenticación mediante credenciales institucionales del SII.
- Consulta de información académica.
- Consulta de calificaciones, Kardex y horarios.
- Administración segura de sesiones.
- Almacenamiento cifrado del token institucional.
- Protección de solicitudes mediante CSRF.
- Publicaciones dentro de una comunidad estudiantil.
- Comentarios y eliminación de comentarios propios.
- Reacciones a publicaciones.
- Almacenamiento de fotografías de perfil e imágenes de publicaciones.

El proyecto utiliza una arquitectura cliente-servidor, donde React funciona como frontend y Node.js con Express como backend.

---

## 2. Arquitectura general

El sistema está compuesto por dos aplicaciones desplegadas en Render y dos proyectos de base de datos independientes en Supabase.

### 2.1 Diagrama general

```text
                 USUARIO
                    |
                    v
             FRONTEND REACT
              (Vite)
                    |
             Solicitudes HTTP
                    |
                    v
             BACKEND EXPRESS
                    |
        +-----------+------------+
        |           |            |
        v           v            v
    AUTENTICACIÓN  ACADÉMICO  COMUNIDAD
        |           |            |
        v           v            v
    SII SERVICE  SII API     COMMUNITY SERVICES
        |                        |
        v                        v
  SUPABASE ACADÉMICO       SUPABASE COMUNIDAD
     PostgreSQL               PostgreSQL
        |                        |
     SESIONES                PUBLICACIONES
     CIFRADAS                COMENTARIOS
                             REACCIONES
                             PERFILES
                                  |
                                  v
                            SUPABASE STORAGE
```

El backend es el intermediario entre el frontend, el SII y las bases de datos. El frontend nunca recibe directamente el JWT institucional.

---

## 3. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| React | Desarrollo de la interfaz de usuario. |
| Vite | Herramienta de desarrollo y compilación del frontend. |
| JavaScript | Lenguaje principal del proyecto. |
| Node.js | Entorno de ejecución del backend. |
| Express | Creación de la API REST. |
| PostgreSQL | Sistema de gestión de bases de datos. |
| Supabase | Administración de bases de datos y almacenamiento. |
| Axios / Fetch | Comunicación HTTP. |
| Nodemon | Reinicio automático del backend durante desarrollo. |
| dotenv | Administración de variables de entorno. |
| Render | Despliegue de frontend y backend. |
| Git / GitHub | Control de versiones y colaboración. |

---

# 4. Despliegue en Render

El proyecto se encuentra desplegado mediante dos servicios independientes.

## 4.1 Servicio Frontend

**Nombre:** examen-3erparcial-frontend

**URL:**

https://examen-3erparcial-frontend.onrender.com

Configuración:

| Parámetro | Valor |
|---|---|
| Tipo de servicio | Static Site |
| Framework | React + Vite |
| Root Directory | frontend |
| Build Command | npm install && npm run build |
| Publish Directory | dist |

Variable de entorno:

```env
VITE_API_URL=https://examen-3erparcial-backend.onrender.com/api
```

El frontend es responsable de presentar la información, capturar las acciones del usuario y enviar solicitudes al backend.

## 4.2 Servicio Backend

**Nombre:** examen-3erparcial-backend

**URL:**

https://examen-3erparcial-backend.onrender.com

Configuración:

| Parámetro | Valor |
|---|---|
| Tipo de servicio | Web Service |
| Entorno | Node.js |
| Root Directory | backend |
| Build Command | npm install |
| Start Command | npm start |

Variable de entorno:

```env
FRONTEND_URL=https://examen-3erparcial-frontend.onrender.com
```

El backend administra la autenticación, las sesiones, las consultas académicas, las publicaciones y la comunicación con las bases de datos.

**Importante:** Las variables de entorno se configuran desde el apartado Environment de cada servicio de Render. No deben escribirse directamente en el código fuente.

---

# 5. Estructura del proyecto

```text
Examen_3erParcial/
│
├── backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── communityDatabase.js
│   │   │   └── communityStorage.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── estudianteController.js
│   │   │   ├── comunidadController.js
│   │   │   ├── comentarioComunidadController.js
│   │   │   └── reaccionComunidadController.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   └── csrfMiddleware.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── estudianteRoutes.js
│   │   │   ├── comunidadRoutes.js
│   │   │   ├── comentarioComunidadRoutes.js
│   │   │   └── reaccionComunidadRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── siiService.js
│   │   │   ├── sessionService.js
│   │   │   ├── bitacoraService.js
│   │   │   ├── comunidadService.js
│   │   │   ├── comentarioComunidadService.js
│   │   │   ├── reaccionComunidadService.js
│   │   │   ├── perfilComunidadService.js
│   │   │   ├── fotoComunidadService.js
│   │   │   └── fotoUrlService.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Comunidad.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── comunidadService.js
│   │   │   ├── comentarioService.js
│   │   │   └── reaccionService.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 6. Flujo de autenticación y almacenamiento del token

La autenticación se realiza utilizando el Sistema Integral de Información (SII) del Instituto Tecnológico de Celaya.

El JWT institucional se mantiene exclusivamente en el backend y nunca se entrega directamente al frontend.

## 6.1 Flujo de inicio de sesión

1. El usuario introduce su correo institucional y contraseña.
2. El frontend solicita un token CSRF al backend.
3. El frontend envía las credenciales al endpoint de inicio de sesión.
4. El backend recibe las credenciales y se comunica con el SII.
5. El SII valida las credenciales y devuelve un JWT institucional.
6. El backend procesa el JWT y obtiene su fecha de expiración.
7. El JWT se cifra mediante el servicio de criptografía.
8. El token cifrado se almacena en la base de datos académica de Supabase.
9. El backend genera una sesión para el usuario.
10. El navegador recibe una cookie de sesión llamada `app_session`.
11. El frontend obtiene un nuevo token CSRF asociado a la sesión autenticada.
12. El usuario accede al Dashboard.

## 6.2 Almacenamiento del JWT

El JWT institucional no se guarda en:

- LocalStorage.
- SessionStorage.
- Cookies accesibles desde JavaScript.
- Variables del frontend.

Se almacena cifrado en PostgreSQL, dentro de la tabla de sesiones.

El backend utiliza el servicio `sessionService.js` para administrar las sesiones.

## 6.3 Cookie de sesión

La cookie utilizada es:

```text
app_session
```

Características:

- HttpOnly.
- Utilizada para identificar la sesión.
- Administrada por el backend.
- Enviada automáticamente en las solicitudes que cumplen sus condiciones de dominio y configuración.

El navegador utiliza esta cookie para identificarse ante el backend sin conocer el JWT institucional.

## 6.4 Recuperación de sesión

Cuando el usuario vuelve a cargar la aplicación:

1. El frontend solicita un token CSRF.
2. El backend identifica la sesión mediante la cookie.
3. Se consulta la vigencia de la sesión.
4. Se recupera el JWT cifrado desde Supabase.
5. El backend valida la sesión.
6. Se devuelve el perfil del estudiante.
7. El frontend permite acceder al Dashboard.

## 6.5 Cierre de sesión

Cuando el usuario cierra sesión:

1. El frontend envía una solicitud al endpoint de logout.
2. Incluye el token CSRF.
3. El backend valida la solicitud.
4. Se elimina o invalida la sesión.
5. Se limpia la cookie de sesión.
6. El frontend limpia su estado de autenticación.

---

# 7. Flujo de almacenamiento del token CSRF

El sistema implementa protección contra ataques Cross-Site Request Forgery (CSRF).

El token CSRF es diferente del JWT institucional.

| Token | Función |
|---|---|
| JWT institucional | Permite al backend consultar los servicios del SII. |
| Token CSRF | Protege las operaciones sensibles realizadas desde el navegador. |
| Cookie de sesión | Identifica la sesión del usuario ante el backend. |

## 7.1 Flujo de obtención del token

```text
FRONTEND
   |
   | GET /api/auth/csrf
   v
BACKEND
   |
   | Genera token CSRF
   v
NAVEGADOR
   |
   | Recibe cookie csrf_token
   v
FRONTEND
   |
   | Conserva csrfToken en memoria
   v
SOLICITUD PROTEGIDA
   |
   | X-CSRF-Token
   v
MIDDLEWARE CSRF
   |
   | Valida el token
   v
CONTROLADOR
```

## 7.2 ¿Dónde se almacena?

- El backend administra la cookie CSRF.
- El frontend mantiene el valor del token en el estado de React.
- El token se envía mediante el encabezado `X-CSRF-Token`.
- No se almacena como JWT institucional.
- No se guarda permanentemente en LocalStorage.

## 7.3 Solicitudes protegidas

Las operaciones sensibles utilizan el encabezado:

```http
X-CSRF-Token: <csrfToken>
```

Además, las solicitudes que utilizan cookies deben enviar las credenciales correspondientes.

En el frontend, el estado del token se administra mediante `csrfToken` en `App.jsx` y se proporciona a los componentes que necesitan realizar operaciones protegidas.

---

# 8. Rutas de la API

La API del backend utiliza el siguiente prefijo:

```text
/api
```

En producción:

```text
https://examen-3erparcial-backend.onrender.com/api
```

En desarrollo:

```text
http://localhost:3000/api
```

## 8.1 Autenticación

Prefijo:

```text
/api/auth
```

| Método | Endpoint | Función |
|---|---|---|
| GET | /api/auth/csrf | Obtiene el token CSRF. |
| POST | /api/auth/login | Inicia sesión. |
| POST | /api/auth/logout | Cierra sesión. |
| GET | /api/auth/me | Obtiene el perfil autenticado. |

## 8.2 Información académica

Prefijo:

```text
/api/estudiante
```

| Método | Endpoint | Función |
|---|---|---|
| GET | /api/estudiante | Información general. |
| GET | /api/estudiante/calificaciones | Consulta de calificaciones. |
| GET | /api/estudiante/kardex | Historial académico. |
| GET | /api/estudiante/horarios | Horario escolar. |

Estas rutas requieren autenticación.

## 8.3 Comunidad Estudiantil

Prefijo:

```text
/api/comunidad
```

Se utiliza para administrar las publicaciones de la comunidad.

Prefijo:

```text
/api/comentarios
```

Se utiliza para consultar y administrar los comentarios asociados a las publicaciones.

Operación de eliminación de comentario propio:

| Método | Endpoint | Función |
|---|---|---|
| DELETE | /api/comentarios/comentario/:comentarioId | Elimina un comentario del usuario autenticado. |

Prefijo:

```text
/api/reacciones
```

Operaciones de reacciones:

| Método | Endpoint | Función |
|---|---|---|
| POST | /api/reacciones/:publicacionId | Registra una reacción. |
| DELETE | /api/reacciones/:publicacionId | Elimina la reacción del usuario. |

Las operaciones de comunidad que modifican información requieren autenticación y protección CSRF.

**Nota:** Los subendpoints adicionales de publicaciones y comentarios deben mantenerse sincronizados con sus archivos `routes` del backend. Esta documentación no inventa rutas que no estén verificadas.

---

# 9. Bases de datos

El proyecto utiliza dos bases de datos PostgreSQL independientes, administradas mediante Supabase.

Esta separación permite mantener aislada la información académica de la información generada por la Comunidad Estudiantil.

## 9.1 Base de datos académica

Se utiliza para administrar la autenticación y las sesiones del sistema.

Responsabilidades:

- Almacenar sesiones de usuarios.
- Guardar el JWT institucional cifrado.
- Controlar la expiración de sesiones.
- Registrar actividades del sistema.

Tabla principal:

### sesiones

| Campo | Función |
|---|---|
| session_hash | Identificador de sesión. |
| user_id | Identificador del usuario. |
| encrypted_token | JWT institucional cifrado. |
| expires_at | Fecha de expiración. |
| created_at | Fecha de creación. |
| updated_at | Fecha de actualización. |

También se utiliza la bitácora de actividades para registrar eventos del sistema.

## 9.2 Base de datos de Comunidad Estudiantil

Se utiliza exclusivamente para la funcionalidad de comunidad.

Tablas principales:

### publicaciones

Almacena las publicaciones realizadas por los estudiantes.

### imagenes_publicacion

Almacena las referencias de las imágenes asociadas a las publicaciones.

### comentarios

Contiene los comentarios realizados por los estudiantes.

### reacciones

Registra las reacciones de los usuarios a las publicaciones.

La restricción de unicidad `uq_reaccion_usuario` evita que un mismo usuario registre más de una reacción del mismo tipo de asociación con una publicación.

### perfiles

Almacena información de perfil utilizada por la comunidad, como nombre y fotografía del estudiante.

### reportes

Tabla prevista para almacenar reportes de contenido. La funcionalidad de reportes y moderación administrativa queda fuera del alcance de la versión 1.

## 9.3 Relación conceptual entre las tablas

```text
             PERFILES
                 |
                 |
                 v
            PUBLICACIONES
             /    |     \
            /     |      \
           v      v       v
    IMAGENES  COMENTARIOS REACCIONES
                    |
                    |
                    v
                PERFILES

             REPORTES
                 |
                 v
            PUBLICACIONES
```

Los identificadores de usuario permiten relacionar la actividad de los estudiantes con sus perfiles.

La base de datos de comunidad se conecta mediante una configuración independiente, sin reutilizar la conexión de la base de datos académica.

---

# 10. Supabase Storage

Además de PostgreSQL, el sistema utiliza Supabase Storage para almacenar fotografías e imágenes.

Bucket utilizado:

```text
comunidad-imagenes
```

El almacenamiento es privado.

Se utiliza para:

- Fotografías de perfil.
- Imágenes asociadas a publicaciones.

Las imágenes se consultan mediante URLs firmadas, generadas desde el backend.

La clave de servicio de Supabase permanece exclusivamente en el backend y nunca debe exponerse al frontend.

---

# 11. Variables de entorno

Las variables de entorno se configuran en el archivo `.env` del backend durante el desarrollo local y en el apartado Environment del servicio Backend en Render durante producción.

## 11.1 Conexión académica

Contiene las credenciales de conexión de la base de datos académica y los parámetros utilizados por `database.js`.

## 11.2 Conexión de Comunidad Estudiantil

Las variables utilizadas para la conexión independiente son:

```env
COMMUNITY_DB_HOST=
COMMUNITY_DB_PORT=
COMMUNITY_DB_NAME=
COMMUNITY_DB_USER=
COMMUNITY_DB_PASSWORD=
```

Estas variables permiten conectar el backend con la base PostgreSQL destinada a la comunidad.

## 11.3 Supabase Storage de Comunidad

```env
COMMUNITY_SUPABASE_URL=
COMMUNITY_SUPABASE_SERVICE_KEY=
COMMUNITY_SUPABASE_BUCKET=comunidad-imagenes
```

## 11.4 Configuración general

El backend también requiere los parámetros de configuración de autenticación, cifrado, CSRF, cookies, conexión con el SII y URL del frontend.

Ejemplo:

```env
FRONTEND_URL=https://examen-3erparcial-frontend.onrender.com
CSRF_SECRET=
```

Los nombres y valores definitivos de las variables adicionales deben corresponder a los utilizados por los archivos de configuración del backend.

**Importante:** No publicar contraseñas, claves privadas, tokens institucionales ni archivos `.env` en GitHub.

---

# 12. Seguridad del sistema

El proyecto incorpora diferentes mecanismos de protección:

- JWT institucional almacenado cifrado.
- Cookies HttpOnly para administrar sesiones.
- Protección CSRF mediante token y encabezado HTTP.
- Middleware de autenticación para rutas protegidas.
- Separación de credenciales entre bases de datos.
- Claves de Supabase almacenadas exclusivamente en el backend.
- URLs firmadas para imágenes privadas.
- Validación de operaciones realizadas por usuarios autenticados.
- Eliminación de comentarios limitada a su autor.

---

# 13. Instalación y ejecución local

## 13.1 Requisitos

- Node.js.
- npm.
- Git.
- Acceso a los proyectos Supabase.
- Credenciales institucionales del SII.
- Variables de entorno correctamente configuradas.

## 13.2 Instalar backend

```bash
cd backend
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Ejecutar en producción:

```bash
npm start
```

El backend utiliza el puerto configurado en su entorno; durante el desarrollo local se utiliza:

```text
http://localhost:3000
```

## 13.3 Instalar frontend

En otra terminal:

```bash
cd frontend
npm install
```

Ejecutar:

```bash
npm run dev
```

Compilar para producción:

```bash
npm run build
```

---

# 14. Despliegue y actualización en Render

El despliegue se realiza mediante GitHub.

La rama configurada para producción es:

```text
main
```

Flujo de actualización:

1. Desarrollar los cambios en una rama de trabajo.
2. Probar localmente el frontend y backend.
3. Realizar los commits correspondientes.
4. Subir la rama a GitHub.
5. Crear un Pull Request hacia `main`.
6. Revisar los cambios y resolver conflictos.
7. Integrar el Pull Request.
8. Render detecta los nuevos cambios en `main`.
9. Render inicia el despliegue de los servicios correspondientes.
10. Verificar que frontend y backend terminen correctamente.

Antes de considerar finalizado un despliegue se debe comprobar:

- Que el frontend compile correctamente.
- Que el backend inicie sin errores.
- Que las variables de entorno estén configuradas.
- Que las rutas de la API respondan correctamente.
- Que las conexiones con ambas bases de datos funcionen.

---

# 15. Estado funcional de Comunidad Estudiantil

La primera versión de Comunidad Estudiantil contempla:

- Visualización de publicaciones.
- Creación de publicaciones.
- Asociación de imágenes.
- Consulta de comentarios.
- Creación de comentarios.
- Eliminación de comentarios propios.
- Reacciones a publicaciones.
- Visualización de perfiles y fotografías.

Las funciones de reportes de contenido y moderación administrativa quedan reservadas para una versión posterior.

---

# 16. Resumen del proyecto

Portal Académico integra los servicios institucionales del SII con una aplicación web propia.

Su arquitectura separa la interfaz, la lógica del servidor, la autenticación y las bases de datos.

La implementación de dos servicios independientes en Render permite desplegar frontend y backend de manera separada, mientras que los dos proyectos PostgreSQL de Supabase mantienen aisladas las sesiones académicas y la información de Comunidad Estudiantil.

El sistema utiliza mecanismos de protección de sesiones, cifrado de tokens, cookies HttpOnly y protección CSRF para mantener la seguridad de las operaciones.

La Comunidad Estudiantil amplía el portal al incorporar herramientas de interacción entre estudiantes mediante publicaciones, comentarios, reacciones y fotografías.