# Frontend – Examen 3er Parcial

## 1. Descripción general

El frontend está desarrollado con React y Vite. Tiene como función principal el proporcionar una interfaz gráfica en la cual los estudiantes pueden iniciar sesión y consultar su información académica.

El frontend se comunica con el backend mediante solicitudes HTTP para obtener y enviar información. La autenticación, administración de sesiones y comunicación con la API institucional del Sistema Integral de Información (SII) son gestionadas por el backend.

### Objetivos principales

- Permitir el inicio y cierre de sesión.
- Mostrar información general del estudiante.
- Consultar calificaciones e historial académico.
- Visualizar los horarios escolares.
- Permitir la interacción con la comunidad estudiantil.
- Comunicarse con el backend sin exponer credenciales ni tokens institucionales.

## 2. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| React | Biblioteca utilizada para construir la interfaz mediante componentes. |
| Vite | Herramienta de desarrollo y construcción del proyecto frontend. |
| JavaScript | Lenguaje utilizado para implementar la lógica de la aplicación. |
| CSS | Diseño y estilos visuales de las interfaces. |
| Fetch API | Realización de solicitudes HTTP al backend. |
| React Hooks | Administración del estado y ciclo de vida de los componentes. |
| React Router (si está configurado) | Navegación entre las diferentes páginas. |

## 3. Estructura del frontend

La organización del proyecto se encuentra distribuida por responsabilidades:

```text
frontend/
│
├── image/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── pages/
│   │   ├── Calificaciones.css
│   │   ├── Calificaciones.jsx
│   │   ├── Comunidad.css
│   │   ├── Comunidad.jsx
│   │   ├── Dashboard.css
│   │   ├── Dashboard.jsx
│   │   ├── Horarios.css
│   │   ├── Horarios.jsx
│   │   ├── Kardex.css
│   │   └── Kardex.jsx
│   │
│   ├── services/
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package-lock.json
└── package.json
```

## 4. Descripción de las carpetas y archivos

### 4.1 Components

**`src/components/`**

Contiene los componentes reutilizables de React.

Su propósito es separar elementos de la interfaz que pueden utilizarse en diferentes páginas, evitando repetir código y facilitando el mantenimiento de la aplicación.

### 4.2 Pages

**`src/pages/`**

Contiene las páginas principales de la aplicación. Cada archivo JSX representa una pantalla o sección funcional del sistema, mientras que su archivo CSS correspondiente contiene los estilos visuales.

**`Calificaciones.jsx`**

Se encarga de consultar y mostrar las calificaciones del estudiante.

**`Calificaciones.css`**

Contiene los estilos utilizados para presentar las calificaciones, evaluaciones y tarjetas de información.

**`Kardex.jsx`**

Muestra el historial académico del estudiante.

**`Kardex.css`**

Contiene los estilos de la tabla, filtros, indicadores y elementos visuales del historial académico.

**`Horarios.jsx`**

Se encarga de consultar y organizar los horarios escolares del estudiante.

**`Horarios.css`**

Define la presentación visual de la agenda semanal y los bloques correspondientes a cada clase.

**`Dashboard.jsx`**

Representa el panel principal de la aplicación.

Su propósito es reunir y presentar información general del estudiante, además de servir como punto de acceso a las diferentes secciones del sistema.

**`Dashboard.css`**

Contiene los estilos correspondientes al panel principal, distribución de elementos y tarjetas informativas.

**`Comunidad.jsx`**

Contiene la interfaz de la sección de comunidad estudiantil.

Su finalidad es permitir la interacción entre estudiantes mediante las publicaciones y funcionalidades disponibles en el sistema.

De acuerdo con los servicios implementados, esta sección contempla operaciones relacionadas con:

- Consulta de publicaciones.
- Creación de publicaciones.
- Consulta de comentarios.
- Creación de comentarios.

**`Comunidad.css`**

Contiene los estilos visuales de las publicaciones, comentarios y elementos de interacción de la comunidad.

### 4.3 Services

**`src/services/`**

Contiene los módulos encargados de comunicarse con el backend.

Su función es separar las solicitudes HTTP de los componentes visuales. De esta manera, las páginas no necesitan implementar directamente toda la lógica de comunicación con el servidor.

Entre las operaciones que se realizan desde los servicios se encuentran:

- Obtención del token CSRF.
- Inicio de sesión.
- Cierre de sesión.
- Consulta de la sesión del estudiante.
- Consulta de información académica.
- Obtención de calificaciones.
- Consulta del Kardex.
- Consulta de horarios.
- Consulta y administración de publicaciones.
- Consulta y registro de comentarios.
- Registro y eliminación de reacciones.

## 5. Comunicación con el backend

El frontend no se comunica directamente con la API institucional del SII.

En su lugar, realiza solicitudes HTTP al backend desarrollado con Node.js y Express, que se encarga de procesar las solicitudes y devolver la información correspondiente.

La dirección base de la API se configura mediante la variable de entorno:

```env
VITE_API_URL=http://localhost:3000/api
```

Si la variable no está definida, la aplicación utiliza como dirección predeterminada:

```text
http://localhost:3000/api
```

### 5.1 Solicitudes HTTP

Para comunicarse con el backend se utiliza la API Fetch de JavaScript.

Las solicitudes permiten:

- Enviar información de inicio de sesión.
- Obtener información del estudiante.
- Consultar las calificaciones.
- Recuperar el historial académico.
- Obtener los horarios.
- Consultar y modificar información de la comunidad.


## 6. Arquitectura de autenticación y seguridad

La autenticación se realiza mediante el backend, evitando que el frontend tenga acceso directo al JWT institucional del SII.

### 6.1 Inicio de sesión

El flujo de autenticación funciona de la siguiente manera:

1. El usuario ingresa sus credenciales institucionales.
2. El frontend solicita al backend un token CSRF.
3. El frontend envía las credenciales al endpoint de inicio de sesión.
4. El backend valida las credenciales con la API institucional.
5. El backend recibe el JWT proporcionado por el SII.
6. El backend cifra y almacena el token en Supabase.
7. El backend crea una sesión y envía una cookie al navegador.
8. El frontend puede consultar la sesión para obtener información del estudiante.

### 6.2 Manejo de sesiones

El frontend utiliza las cookies de sesión para identificarse ante el backend.

Las solicitudes que requieren autenticación utilizan la opción:

```javascript
credentials: "include"
```

Esto permite que el navegador envíe las cookies correspondientes al realizar solicitudes al servidor.

El JWT institucional no se almacena directamente en el frontend ni en localStorage.

### 6.3 Protección CSRF

El frontend participa en la protección CSRF mediante:

- Solicitud del token CSRF al backend.
- Envío del token mediante el encabezado `X-CSRF-Token`.
- Inclusión de las cookies necesarias en las solicitudes.

El backend es responsable de validar el token antes de permitir las operaciones protegidas.

## 7. Integración de las páginas con el backend

Las páginas utilizan los servicios para obtener la información necesaria.

| Página | Información consultada | Funcionalidad |
|---|---|---|
| Dashboard | Información general del estudiante. | Panel principal. |
| Calificaciones | Calificaciones y Kardex. | Consulta y filtrado de evaluaciones. |
| Kardex | Historial académico. | Consulta y filtrado de materias. |
| Horarios | Horarios escolares. | Organización de clases por día y hora. |
| Comunidad | Publicaciones, comentarios y reacciones. | Interacción entre estudiantes. |

## 8. Manejo del estado en React

Para administrar la información y el comportamiento de las páginas se utilizan Hooks de React.

Entre los principales se encuentran:

**useState**

Permite almacenar y actualizar información dentro de los componentes.

Se utiliza, por ejemplo, para manejar:

- Datos obtenidos del backend.
- Estados de carga.
- Mensajes de error.
- Filtros de búsqueda.
- Periodos académicos seleccionados.

**useEffect**

Permite ejecutar operaciones secundarias cuando un componente se monta o cuando cambian determinadas dependencias.

Se utiliza principalmente para realizar consultas al backend cuando se carga una página.

**useMemo**

Permite memorizar el resultado de determinados cálculos para evitar repetir operaciones innecesarias cuando sus dependencias no han cambiado.

Se utiliza para procesar y organizar información, como materias filtradas y horarios agrupados.

## 9. Instalación y ejecución

### 9.1 Requisitos

- Node.js.
- npm.
- Backend configurado y en ejecución.
- Acceso a los servicios del backend.

### 9.2 Instalación de dependencias

Desde el directorio `frontend` ejecutar:

```bash
npm install
```

### 9.3 Variables de entorno

Crear un archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:3000/api
```

Esta variable indica la dirección base del backend al que se enviarán las solicitudes HTTP.

### 9.4 Ejecución en desarrollo

Ejecutar:

```bash
npm run dev
```

Vite iniciará el servidor de desarrollo y mostrará la dirección local para acceder a la aplicación.



