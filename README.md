Backend para la gestión de turnos de un centro de atención médica desarrollado con Node.js, Express y TypeScript.# TurnosMed API

API RESTful para la gestión de **especialidades** y **profesionales médicos** de la institución TurnosMed. Desarrollada con **Node.js, Express y TypeScript** para la materia Integraciones Web (Actividad 2).

Los datos se cargan desde archivos JSON a arrays en memoria, por lo que las altas, bajas y modificaciones son ficticias y solo persisten mientras el servidor está en ejecución.

## Tecnologías

- Node.js (LTS)
- Express
- TypeScript
- Postman (pruebas de integración)

## Instalación y ejecución

1. Clonar el repositorio:

```bash
git clone https://github.com/hoursnicolas10-wq/turnos-medicos.git
cd turnos-medicos
```

2. Instalar dependencias:

```bash
npm install
```

3. Levantar el servidor (según los scripts definidos en `package.json`):

```bash
npm run dev
```

El servidor queda escuchando en `http://localhost:3000`.

## Estructura del proyecto

```
turnos-medicos/
├── postman/          # Colección de Postman (TurnosMed API)
├── src/
│   ├── data/         # Archivos JSON con los datos iniciales
│   ├── index.ts      # Servidor Express, endpoints y middlewares
│   └── resources.ts  # Interfaces, arrays globales y carga de datos
├── package.json
├── tsconfig.json
└── README.md
```

## Endpoints

### Especialidades

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | `/api/especialidades` | Lista todas las especialidades |
| GET | `/api/especialidades/:id` | Busca una especialidad por `especialidadId` |
| POST | `/api/especialidades` | Crea una nueva especialidad |
| DELETE | `/api/especialidades/:id` | Borrado lógico (`activa = false`) |

Body de ejemplo para `POST /api/especialidades`:

```json
{
  "nombreEspecialidad": "Cardiología"
}
```

### Profesionales

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | `/api/profesionales` | Lista todos los profesionales |
| GET | `/api/profesionales/:id` | Busca un profesional por `medicoId` |
| POST | `/api/profesionales` | Registra un profesional con una especialidad existente y activa |
| PUT | `/api/profesionales/:id` | Modifica todos los datos de un profesional |
| DELETE | `/api/profesionales/:id` | Borrado lógico (`activo = false`) |

Body de ejemplo para `POST /api/profesionales`:

```json
{
  "nombre": "Dr. Carlos Gómez",
  "especialidad": "Cardiología"
}
```

Body de ejemplo para `PUT /api/profesionales/:id`:

```json
{
  "nombre": "Dr. Carlos Gómez",
  "especialidad": "Cardiología",
  "activo": true
}
```

## Respuestas y códigos de estado

Todas las respuestas son JSON con un campo `status`:

| Código | `status` | Cuándo ocurre |
| ------ | -------- | ------------- |
| 200 OK | `success` | Consulta, modificación o borrado lógico exitoso |
| 201 Created | `success` | Recurso creado correctamente |
| 400 Bad Request | `fail` | Datos inválidos, faltantes o duplicados |
| 404 Not Found | `fail` | ID inexistente o ruta/método no contemplado |
| 500 Internal Server Error | `error` | Falla inesperada del servidor |

Ejemplo de respuesta exitosa:

```json
{
  "status": "success",
  "data": {}
}
```

Ejemplo de respuesta ante una ruta inexistente:

```json
{
  "status": "fail",
  "message": "La ruta o método 'GET /api/pacientes' no existe en esta API REST."
}
```

## Validaciones principales

- `nombreEspecialidad`, `nombre` y `especialidad` deben ser textos no vacíos.
- No se permiten especialidades duplicadas (sin distinguir mayúsculas).
- Un profesional solo puede asignarse a una especialidad que exista y esté activa.
- En `PUT`, el campo `activo` es obligatorio y debe ser booleano.

## Visualización en consola

Tras cada operación exitosa, el servidor limpia la consola con `console.clear()` y muestra el estado actualizado del recurso con `console.table()`.

## Pruebas con Postman

En la carpeta `postman/` está la colección **TurnosMed API**, con las carpetas *Especialidades* y *Profesionales*. Incluye casos de éxito (happy path) y de fallo (unhappy path), como IDs inexistentes o cuerpos inválidos.

Para usarla: importar el archivo `.json` en Postman y ejecutar el servidor antes de enviar las peticiones.

## Autor

Nicolás Hours