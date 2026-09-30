# TurnosMed API

API RESTful para la gestión de **especialidades** y **profesionales médicos** de TurnosMed. Desarrollada con **Node.js, Express y TypeScript** para la materia Integraciones Web.

Los datos iniciales se cargan desde archivos JSON a arrays en memoria. Por eso las altas, modificaciones y bajas solo persisten mientras el servidor está en ejecución.

## Contenido

- [Tecnologías](#tecnologías)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Convenciones de la API](#convenciones-de-la-api)
- [Documentación de endpoints](#documentación-de-endpoints)
- [Pruebas con Postman](#pruebas-con-postman)
- [Módulo propuesto: Pacientes y Turnos](#módulo-propuesto-pacientes-y-turnos)

## Tecnologías

- Node.js (LTS, con soporte para ejecutar TypeScript; el proyecto se probó con Node 24)
- Express
- TypeScript
- Postman

## Instalación y ejecución

1. Clonar el repositorio:

```bash
git clone https://github.com/hoursnicolas10-wq/turnos-medicos.git
```

2. Entrar a la carpeta del proyecto:

```bash
cd turnos-medicos
```

3. Instalar las dependencias:

```bash
npm install
```

4. Ejecutar el servidor en modo desarrollo:

```bash
npm run dev
```

5. Verificar que la consola muestre los siguientes mensajes:

```
🚀 Servidor ejecutándose en http://localhost:3000
✅ Datos iniciales cargados en memoria.
✅ API lista para recibir peticiones.
```

El servidor queda escuchando en `http://localhost:3000`. El modo desarrollo reinicia el servidor automáticamente al guardar un archivo, y al reiniciarse los datos vuelven a su estado inicial.

## Estructura del proyecto

```
turnos-medicos/
├── postman/                      # Colección de Postman (TurnosMed API)
├── src/
│   ├── controllers/
│   │   ├── especialidades.controller.ts
│   │   ├── profesionales.controller.ts
│   │   └── general.controller.ts  # Bienvenida, 404 global y errores
│   ├── data/                      # JSON con los datos ficticios
│   ├── utils/
│   │   └── mostrarTabla.ts        # console.table del estado de los datos
│   ├── index.ts                   # Configuración, rutas e inicio del servidor
│   └── resources.ts               # Interfaces, arrays globales y carga de datos
├── pacientes-turnos.md            # Propuesta del módulo Pacientes y Turnos
├── package.json
├── tsconfig.json
└── README.md
```

## Convenciones de la API

- **URL base:** `http://localhost:3000`
- **Formato:** todas las peticiones con body y todas las respuestas usan JSON (`Content-Type: application/json`).
- **Estructura de las respuestas:** el campo `status` indica el resultado.

| `status` | Significado |
| -------- | ----------- |
| `success` | La operación se realizó correctamente |
| `fail` | Error del cliente (datos inválidos, recurso o ruta inexistente) |
| `error` | Error inesperado del servidor |

- **Borrado lógico:** los `DELETE` no eliminan el registro, lo marcan como inactivo (`activa: false` en especialidades, `activo: false` en profesionales).
- **Query Params:** ningún endpoint actual utiliza parámetros de consulta.

### Códigos de estado HTTP

| Código | Uso |
| ------ | --- |
| 200 OK | Consulta, modificación o borrado lógico exitoso |
| 201 Created | Recurso creado correctamente |
| 400 Bad Request | Datos faltantes, inválidos o duplicados; JSON mal formado |
| 404 Not Found | ID inexistente, o ruta o método no contemplado |
| 500 Internal Server Error | Falla inesperada del servidor |

### Formato de error

Todas las respuestas de error tienen esta forma:

```json
{
  "status": "fail",
  "message": "Descripción del problema"
}
```

## Documentación de endpoints

| Método | Path | Descripción |
| ------ | ---- | ----------- |
| GET | `/` | Mensaje de bienvenida |
| GET | `/api/especialidades` | Lista las especialidades |
| GET | `/api/especialidades/:id` | Busca una especialidad por ID |
| POST | `/api/especialidades` | Crea una especialidad |
| DELETE | `/api/especialidades/:id` | Desactiva una especialidad |
| GET | `/api/profesionales` | Lista los profesionales |
| GET | `/api/profesionales/:id` | Busca un profesional por ID |
| POST | `/api/profesionales` | Registra un profesional |
| PUT | `/api/profesionales/:id` | Modifica un profesional |
| DELETE | `/api/profesionales/:id` | Desactiva un profesional |

### General

#### `GET /`

Devuelve un mensaje de bienvenida para verificar que la API está activa.

- **Params / Query Params / Body:** no lleva.

| Código | Respuesta |
| ------ | --------- |
| 200 | `{ "status": "success", "message": "¡Hola! Bienvenido a la API REST de TurnosMed" }` |

#### Rutas o métodos inexistentes

Cualquier ruta o método que no esté en la tabla anterior responde:

```json
{
  "status": "fail",
  "message": "La ruta o método 'GET /api/pacientes' no existe en esta API REST."
}
```

Código: **404**.

---

### Especialidades

Modelo:

```json
{
  "especialidadId": "e1b2c3d4-0001-4000-8000-000000000001",
  "nombreEspecialidad": "Cardiología",
  "activa": true
}
```

#### `GET /api/especialidades`

Obtiene el listado completo de especialidades, incluidas las inactivas.

- **Params / Query Params / Body:** no lleva.

| Código | Descripción |
| ------ | ----------- |
| 200 | Listado devuelto correctamente |
| 500 | Error interno del servidor |

Respuesta `200`:

```json
{
  "status": "success",
  "data": [
    {
      "especialidadId": "e1b2c3d4-0001-4000-8000-000000000001",
      "nombreEspecialidad": "Cardiología",
      "activa": true
    }
  ]
}
```

#### `GET /api/especialidades/:id`

Busca una especialidad por su `especialidadId`.

- **Params (path):** `id`, el `especialidadId` de la especialidad (texto).
- **Query Params / Body:** no lleva.

| Código | Descripción |
| ------ | ----------- |
| 200 | Especialidad encontrada |
| 404 | No existe una especialidad con ese ID |
| 500 | Error interno del servidor |

Respuesta `200`:

```json
{
  "status": "success",
  "data": {
    "especialidadId": "e1b2c3d4-0001-4000-8000-000000000001",
    "nombreEspecialidad": "Cardiología",
    "activa": true
  }
}
```

Respuesta `404`:

```json
{
  "status": "fail",
  "message": "Especialidad con ID 99999999 no encontrada"
}
```

#### `POST /api/especialidades`

Crea una nueva especialidad, activa por defecto.

- **Params / Query Params:** no lleva.
- **Body (JSON):**

```json
{
  "nombreEspecialidad": "Dermatología"
}
```

| Campo | Tipo | Obligatorio | Regla |
| ----- | ---- | ----------- | ----- |
| `nombreEspecialidad` | string | Sí | No vacío. No puede repetirse (sin distinguir mayúsculas) |

| Código | Descripción |
| ------ | ----------- |
| 201 | Especialidad creada |
| 400 | Campo faltante o vacío, o especialidad ya existente |
| 500 | Error interno del servidor |

Respuesta `201`:

```json
{
  "status": "success",
  "message": "Especialidad creada correctamente",
  "data": {
    "especialidadId": "9f0c2a7e-5d1b-4c7a-8a11-2b6f3c1d9e10",
    "nombreEspecialidad": "Dermatología",
    "activa": true
  }
}
```

Respuesta `400`:

```json
{
  "status": "fail",
  "message": "El campo nombreEspecialidad es requerido y debe ser un texto válido"
}
```

#### `DELETE /api/especialidades/:id`

Borrado lógico: marca la especialidad como inactiva (`activa: false`).

- **Params (path):** `id`, el `especialidadId` de la especialidad.
- **Query Params / Body:** no lleva.

| Código | Descripción |
| ------ | ----------- |
| 200 | Especialidad desactivada |
| 404 | No existe una especialidad con ese ID |
| 500 | Error interno del servidor |

Respuesta `200`:

```json
{
  "status": "success",
  "message": "Especialidad desactivada correctamente",
  "data": {
    "especialidadId": "e1b2c3d4-0001-4000-8000-000000000001",
    "nombreEspecialidad": "Cardiología",
    "activa": false
  }
}
```

---

### Profesionales

Modelo:

```json
{
  "medicoId": "m1a2b3c4-0001-4000-8000-000000000001",
  "nombre": "Dr. Carlos Gómez",
  "especialidad": "Cardiología",
  "activo": true
}
```

#### `GET /api/profesionales`

Obtiene el listado completo de profesionales, incluidos los inactivos.

- **Params / Query Params / Body:** no lleva.

| Código | Descripción |
| ------ | ----------- |
| 200 | Listado devuelto correctamente |
| 500 | Error interno del servidor |

Respuesta `200`:

```json
{
  "status": "success",
  "data": [
    {
      "medicoId": "m1a2b3c4-0001-4000-8000-000000000001",
      "nombre": "Dr. Carlos Gómez",
      "especialidad": "Cardiología",
      "activo": true
    }
  ]
}
```

#### `GET /api/profesionales/:id`

Busca un profesional por su `medicoId`.

- **Params (path):** `id`, el `medicoId` del profesional.
- **Query Params / Body:** no lleva.

| Código | Descripción |
| ------ | ----------- |
| 200 | Profesional encontrado |
| 404 | No existe un profesional con ese ID |
| 500 | Error interno del servidor |

Respuesta `404`:

```json
{
  "status": "fail",
  "message": "Profesional con ID 99999999 no encontrado"
}
```

#### `POST /api/profesionales`

Registra un nuevo profesional, activo por defecto.

- **Params / Query Params:** no lleva.
- **Body (JSON):**

```json
{
  "nombre": "Dra. Laura Pérez",
  "especialidad": "Cardiología"
}
```

| Campo | Tipo | Obligatorio | Regla |
| ----- | ---- | ----------- | ----- |
| `nombre` | string | Sí | No vacío |
| `especialidad` | string | Sí | No vacío. Debe coincidir con una especialidad existente y activa |

| Código | Descripción |
| ------ | ----------- |
| 201 | Profesional registrado |
| 400 | Campo faltante o vacío, o especialidad inexistente o inactiva |
| 500 | Error interno del servidor |

Respuesta `201`:

```json
{
  "status": "success",
  "message": "Profesional registrado correctamente",
  "data": {
    "medicoId": "4d2b7a9c-3e8f-4f10-9b55-7c1a0e6d2f33",
    "nombre": "Dra. Laura Pérez",
    "especialidad": "Cardiología",
    "activo": true
  }
}
```

Respuesta `400`:

```json
{
  "status": "fail",
  "message": "La especialidad 'Astrología' no existe o se encuentra inactiva"
}
```

#### `PUT /api/profesionales/:id`

Modificación completa de un profesional. Deben enviarse los tres campos.

- **Params (path):** `id`, el `medicoId` del profesional.
- **Query Params:** no lleva.
- **Body (JSON):**

```json
{
  "nombre": "Dr. Carlos A. Gómez",
  "especialidad": "Cardiología",
  "activo": true
}
```

| Campo | Tipo | Obligatorio | Regla |
| ----- | ---- | ----------- | ----- |
| `nombre` | string | Sí | No vacío |
| `especialidad` | string | Sí | No vacío. Debe coincidir con una especialidad existente y activa |
| `activo` | boolean | Sí | Debe ser `true` o `false` |

| Código | Descripción |
| ------ | ----------- |
| 200 | Profesional actualizado |
| 400 | Campo faltante o inválido, o especialidad inexistente o inactiva |
| 404 | No existe un profesional con ese ID |
| 500 | Error interno del servidor |

Respuesta `200`:

```json
{
  "status": "success",
  "message": "Profesional actualizado correctamente",
  "data": {
    "medicoId": "m1a2b3c4-0001-4000-8000-000000000001",
    "nombre": "Dr. Carlos A. Gómez",
    "especialidad": "Cardiología",
    "activo": true
  }
}
```

#### `DELETE /api/profesionales/:id`

Borrado lógico: marca al profesional como inactivo (`activo: false`).

- **Params (path):** `id`, el `medicoId` del profesional.
- **Query Params / Body:** no lleva.

| Código | Descripción |
| ------ | ----------- |
| 200 | Profesional desactivado |
| 404 | No existe un profesional con ese ID |
| 500 | Error interno del servidor |

Respuesta `200`:

```json
{
  "status": "success",
  "message": "Profesional desactivado correctamente",
  "data": {
    "medicoId": "m1a2b3c4-0001-4000-8000-000000000001",
    "nombre": "Dr. Carlos Gómez",
    "especialidad": "Cardiología",
    "activo": false
  }
}
```

## Pruebas con Postman

En la carpeta `postman/` está la colección **TurnosMed API**, con las carpetas *Especialidades* y *Profesionales*. Incluye casos de éxito y de fallo (IDs inexistentes, cuerpos inválidos, rutas inexistentes).

Las peticiones usan la variable `baseUrl` en lugar de una URL fija:

| Variable | Valor |
| -------- | ----- |
| `baseUrl` | `http://localhost:3000` |

Por ejemplo: `{{baseUrl}}/api/especialidades`.

Pasos para usarla:

1. Importar el archivo `.json` de la carpeta `postman/` en Postman.
2. Verificar que la variable `baseUrl` exista en la colección (pestaña *Variables*) con el valor `http://localhost:3000`.
3. Levantar el servidor con `npm run dev`.
4. Ejecutar las peticiones.

## Módulo propuesto: Pacientes y Turnos

El diseño conceptual del próximo módulo (modelado de datos, organización en capas y dos endpoints nuevos) está en [pacientes-turnos.md](./pacientes-turnos.md). Todavía no está implementado.

## Autor

Nicolás Hours
