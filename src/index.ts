import express from 'express';
import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import {
  arrayEspecialidades,
  arrayProfesionales,
  cargarDatos,
} from './resources.js';

import type {
  IEspecialidad,
  IProfesional,
} from './resources.js';

const app = express();
const PORT = 3000;

// Permite recibir cuerpos JSON en las peticiones POST y PUT
app.use(express.json());

// ==========================================
// FUNCIÓN AUXILIAR PARA MOSTRAR TABLAS
// ==========================================

function mostrarTablaRecurso(
  titulo: string,
  datos: IEspecialidad[] | IProfesional[]
): void {
  console.clear();
  console.log(`=== ${titulo.toUpperCase()} ===`);
  console.table(datos);
}

// ==========================================
// ENDPOINTS DE ESPECIALIDADES
// ==========================================

// GET /api/especialidades
// Obtener el listado completo de especialidades
app.get('/api/especialidades', (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      status: 'success',
      data: arrayEspecialidades,
    });
  } catch (error) {
    console.error('Error al obtener especialidades:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
});

// GET /api/especialidades/:id
// Buscar una especialidad específica por especialidadId
app.get('/api/especialidades/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const especialidad = arrayEspecialidades.find(
      (e) => e.especialidadId === id
    );

    if (!especialidad) {
      return res.status(404).json({
        status: 'fail',
        message: `Especialidad con ID ${id} no encontrada`,
      });
    }

    return res.status(200).json({
      status: 'success',
      data: especialidad,
    });
  } catch (error) {
    console.error('Error al buscar especialidad:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
});

// POST /api/especialidades
// Crear una nueva especialidad
app.post('/api/especialidades', (req: Request, res: Response) => {
  try {
    const { nombreEspecialidad } = req.body;

    // Validación del payload
    if (
      typeof nombreEspecialidad !== 'string' ||
      nombreEspecialidad.trim() === ''
    ) {
      return res.status(400).json({
        status: 'fail',
        message:
          'El campo nombreEspecialidad es requerido y debe ser un texto válido',
      });
    }

    const nombreNormalizado = nombreEspecialidad.trim();

    // Evitar especialidades duplicadas
    const especialidadExistente = arrayEspecialidades.find(
      (e) =>
        e.nombreEspecialidad.toLowerCase() === nombreNormalizado.toLowerCase()
    );

    if (especialidadExistente) {
      return res.status(400).json({
        status: 'fail',
        message: `La especialidad '${nombreNormalizado}' ya existe en el sistema`,
      });
    }

    const nuevaEspecialidad: IEspecialidad = {
      especialidadId: randomUUID(),
      nombreEspecialidad: nombreNormalizado,
      activa: true,
    };

    arrayEspecialidades.push(nuevaEspecialidad);

    // Mostrar estado actualizado después de la operación exitosa
    mostrarTablaRecurso(
      'Especialidad creada',
      arrayEspecialidades
    );

    return res.status(201).json({
      status: 'success',
      message: 'Especialidad creada correctamente',
      data: nuevaEspecialidad,
    });
  } catch (error) {
    console.error('Error al crear especialidad:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
});

// DELETE /api/especialidades/:id
// Borrado lógico de una especialidad
app.delete('/api/especialidades/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const especialidad = arrayEspecialidades.find(
      (e) => e.especialidadId === id
    );

    if (!especialidad) {
      return res.status(404).json({
        status: 'fail',
        message: `Especialidad con ID ${id} no encontrada`,
      });
    }

    // Soft delete
    especialidad.activa = false;

    // Mostrar estado actualizado
    mostrarTablaRecurso(
      'Especialidad desactivada (Soft Delete)',
      arrayEspecialidades
    );

    return res.status(200).json({
      status: 'success',
      message: 'Especialidad desactivada correctamente',
      data: especialidad,
    });
  } catch (error) {
    console.error('Error al desactivar especialidad:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
});

// ==========================================
// ENDPOINTS DE PROFESIONALES
// ==========================================

// GET /api/profesionales
// Obtener el listado completo de profesionales
app.get('/api/profesionales', (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      status: 'success',
      data: arrayProfesionales,
    });
  } catch (error) {
    console.error('Error al obtener profesionales:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
});

// GET /api/profesionales/:id
// Buscar un profesional específico por medicoId
app.get('/api/profesionales/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const profesional = arrayProfesionales.find(
      (p) => p.medicoId === id
    );

    if (!profesional) {
      return res.status(404).json({
        status: 'fail',
        message: `Profesional con ID ${id} no encontrado`,
      });
    }

    return res.status(200).json({
      status: 'success',
      data: profesional,
    });
  } catch (error) {
    console.error('Error al buscar profesional:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
});

// POST /api/profesionales
// Registrar un nuevo profesional
app.post('/api/profesionales', (req: Request, res: Response) => {
  try {
    const { nombre, especialidad } = req.body;

    // Validar nombre
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({
        status: 'fail',
        message: 'El campo nombre es obligatorio y debe ser un texto válido',
      });
    }

    // Validar especialidad
    if (
      typeof especialidad !== 'string' ||
      especialidad.trim() === ''
    ) {
      return res.status(400).json({
        status: 'fail',
        message:
          'El campo especialidad es obligatorio y debe ser un texto válido',
      });
    }

    const nombreProfesional = nombre.trim();
    const nombreEspecialidad = especialidad.trim();

    // Verificar que la especialidad exista y esté activa
    const existeEspecialidad = arrayEspecialidades.some(
      (e) =>
        e.nombreEspecialidad.toLowerCase() ===
          nombreEspecialidad.toLowerCase() &&
        e.activa === true
    );

    if (!existeEspecialidad) {
      return res.status(400).json({
        status: 'fail',
        message: `La especialidad '${nombreEspecialidad}' no existe o se encuentra inactiva`,
      });
    }

    const nuevoProfesional: IProfesional = {
      medicoId: randomUUID(),
      nombre: nombreProfesional,
      especialidad: nombreEspecialidad,
      activo: true,
    };

    arrayProfesionales.push(nuevoProfesional);

    // Mostrar estado actualizado
    mostrarTablaRecurso(
      'Profesional registrado',
      arrayProfesionales
    );

    return res.status(201).json({
      status: 'success',
      message: 'Profesional registrado correctamente',
      data: nuevoProfesional,
    });
  } catch (error) {
    console.error('Error al registrar profesional:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
});

// PUT /api/profesionales/:id
// Modificación completa de un profesional
app.put('/api/profesionales/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, especialidad, activo } = req.body;

    // Buscar profesional
    const profesional = arrayProfesionales.find(
      (p) => p.medicoId === id
    );

    if (!profesional) {
      return res.status(404).json({
        status: 'fail',
        message: `Profesional con ID ${id} no encontrado`,
      });
    }

    // Validar nombre
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({
        status: 'fail',
        message:
          'El campo nombre es obligatorio y debe ser un texto válido',
      });
    }

    // Validar especialidad
    if (
      typeof especialidad !== 'string' ||
      especialidad.trim() === ''
    ) {
      return res.status(400).json({
        status: 'fail',
        message:
          'El campo especialidad es obligatorio y debe ser un texto válido',
      });
    }

    // Validar activo
    if (typeof activo !== 'boolean') {
      return res.status(400).json({
        status: 'fail',
        message: 'El campo activo es obligatorio y debe ser booleano',
      });
    }

    const nombreProfesional = nombre.trim();
    const nombreEspecialidad = especialidad.trim();

    // Verificar que la especialidad exista y esté activa
    const existeEspecialidad = arrayEspecialidades.some(
      (e) =>
        e.nombreEspecialidad.toLowerCase() ===
          nombreEspecialidad.toLowerCase() &&
        e.activa === true
    );

    if (!existeEspecialidad) {
      return res.status(400).json({
        status: 'fail',
        message: `La especialidad '${nombreEspecialidad}' no existe o se encuentra inactiva`,
      });
    }

    // Actualización completa
    profesional.nombre = nombreProfesional;
    profesional.especialidad = nombreEspecialidad;
    profesional.activo = activo;

    // Mostrar estado actualizado
    mostrarTablaRecurso(
      'Profesional actualizado',
      arrayProfesionales
    );

    return res.status(200).json({
      status: 'success',
      message: 'Profesional actualizado correctamente',
      data: profesional,
    });
  } catch (error) {
    console.error('Error al actualizar profesional:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
});

// DELETE /api/profesionales/:id
// Borrado lógico de un profesional
app.delete('/api/profesionales/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const profesional = arrayProfesionales.find(
      (p) => p.medicoId === id
    );

    if (!profesional) {
      return res.status(404).json({
        status: 'fail',
        message: `Profesional con ID ${id} no encontrado`,
      });
    }

    // Soft delete
    profesional.activo = false;

    // Mostrar estado actualizado
    mostrarTablaRecurso(
      'Profesional desactivado (Soft Delete)',
      arrayProfesionales
    );

    return res.status(200).json({
      status: 'success',
      message: 'Profesional desactivado correctamente',
      data: profesional,
    });
  } catch (error) {
    console.error('Error al desactivar profesional:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
});

// ==========================================
// MIDDLEWARE GLOBAL PARA RUTAS INEXISTENTES
// ==========================================

// Este middleware debe estar al final de todas las rutas.
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    status: 'fail',
    message: `La ruta o método '${req.method} ${req.originalUrl}' no existe en esta API REST.`,
  });
});

// ==========================================
// INICIALIZACIÓN DEL SERVIDOR
// ==========================================

async function iniciarServidor(): Promise<void> {
  try {
    // Cargar los JSON en los arrays globales
    await cargarDatos();

    console.clear();

    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log('✅ Datos iniciales cargados en memoria.');

    app.listen(PORT, () => {
      console.log('✅ API lista para recibir peticiones.');
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
}

iniciarServidor();