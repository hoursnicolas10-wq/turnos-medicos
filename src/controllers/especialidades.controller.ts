import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import { arrayEspecialidades } from '../resources.ts';
import type { IEspecialidad } from '../resources.ts';
import { mostrarTablaRecurso } from '../utils/mostrarTabla.ts';

// GET /api/especialidades
export const obtenerEspecialidades = async (req: Request, res: Response) => {
  let status: number = 200;

  try {
    mostrarTablaRecurso('Listado de especialidades', arrayEspecialidades);

    return res.status(status).json({
      status: 'success',
      data: arrayEspecialidades,
    });
  } catch (error) {
    if (status < 400) status = 500;
    if (status === 500) console.error('Error al obtener especialidades:', error);

    return res.status(status).json({
      status: status === 500 ? 'error' : 'fail',
      message:
        status === 500
          ? 'Error interno del servidor'
          : (error as Error).message,
    });
  }
};

// GET /api/especialidades/:id
export const obtenerEspecialidadPorId = async (req: Request, res: Response) => {
  let status: number = 200;

  try {
    const { id } = req.params;

    const especialidad = arrayEspecialidades.find(
      (e) => e.especialidadId === id
    );

    if (!especialidad) {
      status = 404;
      throw new Error(`Especialidad con ID ${id} no encontrada`);
    }

    mostrarTablaRecurso('Especialidad consultada', [especialidad]);

    return res.status(status).json({
      status: 'success',
      data: especialidad,
    });
  } catch (error) {
    if (status < 400) status = 500;
    if (status === 500) console.error('Error al buscar especialidad:', error);

    return res.status(status).json({
      status: status === 500 ? 'error' : 'fail',
      message:
        status === 500
          ? 'Error interno del servidor'
          : (error as Error).message,
    });
  }
};

// POST /api/especialidades
export const crearEspecialidad = async (req: Request, res: Response) => {
  let status: number = 201;

  try {
    const { nombreEspecialidad } = req.body ?? {};

    // Validación previa del payload
    if (
      typeof nombreEspecialidad !== 'string' ||
      nombreEspecialidad.trim() === ''
    ) {
      status = 400;
      throw new Error(
        'El campo nombreEspecialidad es requerido y debe ser un texto válido'
      );
    }

    const nombreNormalizado = nombreEspecialidad.trim();

    // Validación previa: evitar duplicados
    const especialidadExistente = arrayEspecialidades.find(
      (e) =>
        e.nombreEspecialidad.toLowerCase() === nombreNormalizado.toLowerCase()
    );

    if (especialidadExistente) {
      status = 400;
      throw new Error(
        `La especialidad '${nombreNormalizado}' ya existe en el sistema`
      );
    }

    const nuevaEspecialidad: IEspecialidad = {
      especialidadId: randomUUID(),
      nombreEspecialidad: nombreNormalizado,
      activa: true,
    };

    arrayEspecialidades.push(nuevaEspecialidad);

    mostrarTablaRecurso('Especialidad creada', arrayEspecialidades);

    return res.status(status).json({
      status: 'success',
      message: 'Especialidad creada correctamente',
      data: nuevaEspecialidad,
    });
  } catch (error) {
    if (status < 400) status = 500;
    if (status === 500) console.error('Error al crear especialidad:', error);

    return res.status(status).json({
      status: status === 500 ? 'error' : 'fail',
      message:
        status === 500
          ? 'Error interno del servidor'
          : (error as Error).message,
    });
  }
};

// DELETE /api/especialidades/:id (borrado lógico)
export const eliminarEspecialidad = async (req: Request, res: Response) => {
  let status: number = 200;

  try {
    const { id } = req.params;

    const especialidad = arrayEspecialidades.find(
      (e) => e.especialidadId === id
    );

    if (!especialidad) {
      status = 404;
      throw new Error(`Especialidad con ID ${id} no encontrada`);
    }

    // Soft delete
    especialidad.activa = false;

    mostrarTablaRecurso(
      'Especialidad desactivada (Soft Delete)',
      arrayEspecialidades
    );

    return res.status(status).json({
      status: 'success',
      message: 'Especialidad desactivada correctamente',
      data: especialidad,
    });
  } catch (error) {
    if (status < 400) status = 500;
    if (status === 500) console.error('Error al desactivar especialidad:', error);

    return res.status(status).json({
      status: status === 500 ? 'error' : 'fail',
      message:
        status === 500
          ? 'Error interno del servidor'
          : (error as Error).message,
    });
  }
};