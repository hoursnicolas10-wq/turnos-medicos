# Propuesta de módulo: Pacientes y Turnos

Mockup técnico (RESTful) para el módulo de **pacientes** y **turnos médicos** de *TurnosMed*. Este documento es una definición de interfaces para que el equipo de Frontend pueda avanzar. **No está implementado todavía** en el servidor.

## 1. Investigación de requerimientos

### Datos mínimos de un Paciente

| Campo | Tipo | Obligatorio | Motivo |
| ----- | ---- | ----------- | ------ |
| `dni` | string (7 u 8 dígitos) | Sí | Identificador único de la persona; evita pacientes duplicados |
| `nombre` | string | Sí | Identificación |
| `apellido` | string | Sí | Identificación |
| `fechaNacimiento` | string (`YYYY-MM-DD`) | Sí | Calcular la edad y validar que no sea una fecha futura |
| `telefono` | string | Sí | Contacto para confirmar o reprogramar turnos |
| `email` | string | No | Contacto alternativo |

El sistema agrega por su cuenta `pacienteId` (UUID) y `activo` (para el borrado lógico).

### Datos mínimos de un Turno

| Campo | Tipo | Obligatorio | Motivo |
| ----- | ---- | ----------- | ------ |
| `pacienteId` | string (UUID) | Sí | Paciente que recibe la atención (debe existir y estar activo) |
| `medicoId` | string (UUID) | Sí | Profesional que atiende (debe existir y estar activo) |
| `fechaHora` | string (ISO 8601) | Sí | Día y hora del turno (debe ser futura) |
| `motivoConsulta` | string | No | Ayuda al profesional a preparar la consulta |

El sistema agrega `turnoId` (UUID) y `estado`, que empieza siempre en `programado`.

## 2. Modelado de datos

Un **Paciente** puede tener muchos **Turnos**, y un **Profesional** también puede tener muchos **Turnos**. Es decir, el turno es la entidad que relaciona a ambos (relación uno a muchos desde cada lado), y por eso guarda `pacienteId` y `medicoId` como referencias.

```typescript
export interface IPaciente {
  pacienteId: string;
  dni: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // YYYY-MM-DD
  telefono: string;
  email?: string;
  activo: boolean;
}

export type EstadoTurno = 'programado' | 'cancelado' | 'completado';

export interface ITurno {
  turnoId: string;
  pacienteId: string;
  medicoId: string;
  fechaHora: string; // ISO 8601, por ejemplo 2026-10-15T10:30:00
  motivoConsulta?: string;
  estado: EstadoTurno;
}
```

DTOs de entrada (lo que envía el cliente en el body):

```typescript
export type CrearPacienteDTO = Omit<IPaciente, 'pacienteId' | 'activo'>;

export type CrearTurnoDTO = Omit<ITurno, 'turnoId' | 'estado'>;
```

## 3. Organización propuesta (Clean Architecture)

La idea es separar las responsabilidades en capas, donde cada capa solo conoce a la que está debajo:

```
src/
├── domain/                  # Reglas del negocio, sin depender de Express
│   └── entities/            # IPaciente, ITurno
├── application/             # Casos de uso
│   └── use-cases/           # crearPaciente, crearTurno
├── infrastructure/          # Acceso a datos (hoy: arrays en memoria / JSON)
│   └── repositories/        # pacientes.repository, turnos.repository
└── presentation/            # Lo que conoce HTTP
    ├── controllers/         # Reciben req/res, llaman al caso de uso
    └── routes/              # Asocian método + path con un controller
```

| Capa | Responsabilidad en este módulo |
| ---- | ------------------------------ |
| Controller | Lee el body, llama al caso de uso y responde con el código HTTP correspondiente |
| Caso de uso | Valida las reglas de negocio (DNI único, paciente y profesional existentes, horario libre) |
| Repositorio | Guarda y consulta los datos; si mañana se cambia a una base de datos, solo cambia esta capa |
| Entidad | Define la forma de los datos |

Los controllers actuales del proyecto (`src/controllers/`) ya siguen la separación ruta → controller, por lo que este módulo se sumaría con la misma estructura.

## 4. Endpoints propuestos

Las respuestas mantienen el formato actual de la API: `status` con valor `success`, `fail` o `error`.

### 4.1 `POST /api/pacientes`: registrar un paciente

**Descripción:** crea un paciente nuevo en el sistema.

**Body (JSON):**

```json
{
  "dni": "40123456",
  "nombre": "Lucía",
  "apellido": "Fernández",
  "fechaNacimiento": "1995-04-18",
  "telefono": "2994123456",
  "email": "lucia.fernandez@example.com"
}
```

**Validaciones:**

- `dni`: texto de 7 u 8 dígitos, y no puede existir otro paciente con el mismo DNI.
- `nombre`, `apellido` y `telefono`: textos no vacíos.
- `fechaNacimiento`: fecha válida con formato `YYYY-MM-DD` y no futura.
- `email` (si se envía): debe tener formato de correo.

**Respuesta exitosa: `201 Created`**

```json
{
  "status": "success",
  "message": "Paciente registrado correctamente",
  "data": {
    "pacienteId": "a3f1c2d4-0001-4000-8000-000000000001",
    "dni": "40123456",
    "nombre": "Lucía",
    "apellido": "Fernández",
    "fechaNacimiento": "1995-04-18",
    "telefono": "2994123456",
    "email": "lucia.fernandez@example.com",
    "activo": true
  }
}
```

**Respuestas de error:**

| Código | Cuándo | Ejemplo de `message` |
| ------ | ------ | -------------------- |
| 400 | Campo faltante o con formato inválido | `El campo dni es obligatorio y debe tener 7 u 8 dígitos` |
| 400 | DNI ya registrado | `Ya existe un paciente con el DNI 40123456` |
| 500 | Falla inesperada | `Error interno del servidor` |

### 4.2 `POST /api/turnos`: asignar un turno

**Descripción:** crea un turno que vincula a un paciente con un profesional en una fecha y hora.

**Body (JSON):**

```json
{
  "pacienteId": "a3f1c2d4-0001-4000-8000-000000000001",
  "medicoId": "m1a2b3c4-0001-4000-8000-000000000001",
  "fechaHora": "2026-10-15T10:30:00",
  "motivoConsulta": "Control anual"
}
```

**Validaciones:**

- `pacienteId` y `medicoId`: deben existir y estar activos.
- `fechaHora`: fecha y hora válidas en formato ISO 8601, y posteriores al momento actual.
- El profesional no puede tener otro turno `programado` en la misma `fechaHora`.
- `motivoConsulta` (si se envía): texto no vacío.

**Respuesta exitosa: `201 Created`**

```json
{
  "status": "success",
  "message": "Turno asignado correctamente",
  "data": {
    "turnoId": "t9b8c7d6-0001-4000-8000-000000000001",
    "pacienteId": "a3f1c2d4-0001-4000-8000-000000000001",
    "medicoId": "m1a2b3c4-0001-4000-8000-000000000001",
    "fechaHora": "2026-10-15T10:30:00",
    "motivoConsulta": "Control anual",
    "estado": "programado"
  }
}
```

**Respuestas de error:**

| Código | Cuándo | Ejemplo de `message` |
| ------ | ------ | -------------------- |
| 400 | Campo faltante o con formato inválido | `El campo fechaHora es obligatorio y debe ser una fecha ISO 8601 válida` |
| 400 | La fecha ya pasó | `La fecha del turno debe ser posterior al momento actual` |
| 400 | El profesional ya tiene un turno a esa hora | `El profesional ya tiene un turno asignado en ese horario` |
| 404 | El paciente no existe o está inactivo | `Paciente con ID ... no encontrado` |
| 404 | El profesional no existe o está inactivo | `Profesional con ID ... no encontrado` |
| 500 | Falla inesperada | `Error interno del servidor` |

## 5. Flujo previsto para el Frontend

1. Registrar al paciente con `POST /api/pacientes` y guardar el `pacienteId` de la respuesta.
2. Consultar los profesionales con `GET /api/profesionales` y elegir un `medicoId`.
3. Asignar el turno con `POST /api/turnos`, enviando ambos IDs y la fecha y hora elegidas.