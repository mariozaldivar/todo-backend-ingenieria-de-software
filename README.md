# SISTEMA TO-DO Ingeniería de Software.

### Mario Andrés Zaldívar de la Cruz

Back-end para una TODO-app escrita en ExpressJS utilizando MongoDB. 
Permite registrar usuarios y crear tareas para este usuario, leerlas y modificarlas. 

Para instalar y correr:

- Es necesario haber instalado Node anteriormente
- En la plataforma de MongoDB, crear una DB llamada "todo", con dos colecciones, "users" y "tareas"
- Clonar el repositorio
- Abrir la terminal, y en el mismo directorio en el que está el pacakge.json, correr:

```bash
npm install
```

- Copiar .env.example a .env, y llenar las variables de entorno adecuadamente.
- Para iniciar el servidor, correr:

```bash
npm start
```

## Estructura del programa:

/config -> Contiene la función de conexión a MongoDB, y otras utilidades.
/controllers -> Contiene los controladores para cada colección, implementa las funcionalidades del programa como tal.
/middleware -> Contiene los middlewares comunes para cada ruta, encargandose de la autenticación y manejo de errores.
/models -> Contiene los modelos para los objetos que se introduciran a la base de datos NoSQL. Con estos se puede asegurar mantener una estructura común.
/routes -> Contiene la delcaración explícita de las rutas de la API, con un archivo para cada servicio donde se asigna un controlador a una ruta.
/server.js -> El archivo que ejecuta directamente el servidor, e implementa todos los demás directorios.

## Lista de endpoints: 

URL base: `http://localhost:<PORT>` (por defecto `5000`).

Los endpoints marcados como **protegidos** requieren el encabezado:

```
Authorization: Bearer <token>
```

El token se obtiene en `POST /api/users/login` y es válido por 30 días.

### Usuarios — `/api/users`

| Método | Ruta | Protegido | Descripción |
|---|---|---|---|
| POST | `/api/users` | No | Registra un nuevo usuario. |
| POST | `/api/users/login` | No | Inicia sesión y devuelve un token JWT. |
| GET | `/api/users/datos` | Sí | Devuelve los datos del usuario autenticado (sin password). |

**POST `/api/users`** — Body:
```json
{ "name": "Mario", "email": "mario@correo.com", "password": "123456" }
```
Respuestas: `200` con `_id`, `name`, `email` y `password` (hasheado) · `400` si falta un campo o el email ya está registrado.

**POST `/api/users/login`** — Body:
```json
{ "email": "mario@correo.com", "password": "123456" }
```
Respuestas: `200` con `_id`, `name`, `email` y `token` · `401` si las credenciales son incorrectas.

**GET `/api/users/datos`** — Respuestas: `200` con `_id`, `name`, `email`, `esAdmin`, `createdAt` y `updatedAt` · `401` si no se envía un token válido.

### Tareas — `/api/tareas`

Todas las rutas de tareas son protegidas y solo operan sobre las tareas del usuario autenticado.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/tareas` | Lista las tareas del usuario. |
| POST | `/api/tareas` | Crea una nueva tarea. |
| PUT | `/api/tareas/:id` | Actualiza la tarea con el `id` indicado. |
| DELETE | `/api/tareas/:id` | Elimina la tarea con el `id` indicado. |

**GET `/api/tareas`** — Respuestas: `200` con un arreglo de tareas.

**POST `/api/tareas`** — Body:
```json
{ "descripcion": "Terminar la actividad" }
```
Respuestas: `201` con `{ "tarea": { ... } }` · `400` si falta la descripción.

**PUT `/api/tareas/:id`** — Body: los campos a modificar, p. ej. `{ "descripcion": "Nueva descripción" }`.
Respuestas: `200` con la tarea actualizada · `404` si no existe · `401` si pertenece a otro usuario.

**DELETE `/api/tareas/:id`** — Respuestas: `200` con `{ "id": "<id>" }` · `404` si no existe · `401` si pertenece a otro usuario.

### Errores

Los errores responden con el código HTTP correspondiente y el cuerpo:
```json
{ "message": "Descripción del error", "stack": "..." }
```
`stack` es `null` cuando `NODE_ENV=production`.
