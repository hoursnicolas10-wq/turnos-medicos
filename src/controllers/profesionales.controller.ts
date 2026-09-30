import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import { arrayEspecialidades, arrayProfesionales } from '../resources.ts';
import type { IProfesional } from '../resources.ts';
import { mostrarTablaRecurso } from '../utils/mostrarTabla.ts';

// GET /api/profesionales
export const obtenerProfesionales = async (req: Request, res: Response) => {
  let status: number = 200;

  try {
    mostrarTablaRecurso('Listado de profesionales', arrayProfesionales);

    return res.status(status).json({
      status: 'success',
      data: arrayProfesionales,
    });
  } catch (error) {
    if (status < 400) status = 500;
    if (status === 500) console.error('Error al obtener profesionales:', error);

    return res.status(status).json({
      status: status === 500 ? 'error' : 'fail',
      message:
        status === 500
          ? 'Error interno del servidor'
          : (error as Error).message,
    });
  }
};

// GET /api/profesionales/:id
export const obtenerProfesionalPorId = async (req: Request, res: Response) => {
  let status: number = 200;

  try {
    const { id } = req.params;

    const profesional = arrayProfesionales.find((p) => p.medicoId === id);

    if (!profesional) {
      status = 404;
      throw new Error(`Profesional con ID ${id} no encontrado`);
    }

    mostrarTablaRecurso('Profesional consultado', [profesional]);

    return res.status(status).json({
      status: 'success',
      data: profesional,
    });
  } catch (error) {
    if (status < 400) status = 500;
    if (status === 500) console.error('Error al buscar profesional:', error);

    return res.status(status).json({
      status: status === 500 ? 'error' : 'fail',
      message:
        status === 500
          ? 'Error interno del servidor'
          : (error as Error).message,
    });
  }
};

// POST /api/profesionales
export const crearProfesional = async (req: Request, res: Response) => {
  let status: number = 201;

  try {
    const { nombre, especialidad } = req.body ?? {};

    // Validaciones previas del payload
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      status = 400;
      throw new Error('El campo nombre es obligatorio y debe ser un texto válido');
    }

    if (typeof especialidad !== 'string' || especialidad.trim() === '') {
      status = 400;
      throw new Error(
        'El campo especialidad es obligatorio y debe ser un texto válido'
      );
    }

    const nombreProfesional = nombre.trim();
    const nombreEspecialidad = especialidad.trim();

    // Validación previa: la especialidad debe existir y estar activa
    const existeEspecialidad = arrayEspecialidades.some(
      (e) =>
        e.nombreEspecialidad.toLowerCase() ===
          nombreEspecialidad.toLowerCase() && e.activa === true
    );

    if (!existeEspecialidad) {
      status = 400;
      throw new Error(
        `La especialidad '${nombreEspecialidad}' no existe o se encuentra inactiva`
      );
    }

    const nuevoProfesional: IProfesional = {
      medicoId: randomUUID(),
      nombre: nombreProfesional,
      especialidad: nombreEspecialidad,
      activo: true,
    };

    arrayProfesionales.push(nuevoProfesional);

    mostrarTablaRecurso('Profesional registrado', arrayProfesionales);

    return res.status(status).json({
      status: 'success',
      message: 'Profesional registrado correctamente',
      data: nuevoProfesional,
    });
  } catch (error) {
    if (status < 400) status = 500;
    if (status === 500) console.error('Error al registrar profesional:', error);

    return res.status(status).json({
      status: status === 500 ? 'error' : 'fail',
      message:
        status === 500
          ? 'Error interno del servidor'
          : (error as Error).message,
    });
  }
};

// PUT /api/profesionales/:id
export const actualizarProfesional = async (req: Request, res: Response) => {
  let status: number = 200;

  try {
    const { id } = req.params;
    const { nombre, especialidad, activo } = req.body ?? {};

    const profesional = arrayProfesionales.find((p) => p.medicoId === id);

    if (!profesional) {
      status = 404;
      throw new Error(`Profesional con ID ${id} no encontrado`);
    }

    // Validaciones previas del payload
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      status = 400;
      throw new Error('El campo nombre es obligatorio y debe ser un texto válido');
    }

    if (typeof especialidad !== 'string' || especialidad.trim() === '') {
      status = 400;
      throw new Error(
        'El campo especialidad es obligatorio y debe ser un texto válido'
      );
    }

    if (typeof activo !== 'boolean') {
      status = 400;
      throw new Error('El campo activo es obligatorio y debe ser booleano');
    }

    const nombreProfesional = nombre.trim();
    const nombreEspecialidad = especialidad.trim();

    const existeEspecialidad = arrayEspecialidades.some(
      (e) =>
        e.nombreEspecialidad.toLowerCase() ===
          nombreEspecialidad.toLowerCase() && e.activa === true
    );

    if (!existeEspecialidad) {
      status = 400;
      throw new Error(
        `La especialidad '${nombreEspecialidad}' no existe o se encuentra inactiva`
      );
    }

    // Actualización completa
    profesional.nombre = nombreProfesional;
    profesional.especialidad = nombreEspecialidad;
    profesional.activo = activo;

    mostrarTablaRecurso('Profesional actualizado', arrayProfesionales);

    return res.status(status).json({
      status: 'success',
      message: 'Profesional actualizado correctamente',
      data: profesional,
    });
  } catch (error) {
    if (status < 400) status = 500;
    if (status === 500) console.error('Error al actualizar profesional:', error);

    return res.status(status).json({
      status: status === 500 ? 'error' : 'fail',
      message:
        status === 500
          ? 'Error interno del servidor'
          : (error as Error).message,
    });
  }
};

// DELETE /api/profesionales/:id (borrado lógico)
export const eliminarProfesional = async (req: Request, res: Response) => {
  let status: number = 200;

  try {
    const { id } = req.params;

    const profesional = arrayProfesionales.find((p) => p.medicoId === id);

    if (!profesional) {
      status = 404;
      throw new Error(`Profesional con ID ${id} no encontrado`);
    }

    // Soft delete
    profesional.activo = false;

    mostrarTablaRecurso(
      'Profesional desactivado (Soft Delete)',
      arrayProfesionales
    );

    return res.status(status).json({
      status: 'success',
      message: 'Profesional desactivado correctamente',
      data: profesional,
    });
  } catch (error) {
    if (status < 400) status = 500;
    if (status === 500) console.error('Error al desactivar profesional:', error);

    return res.status(status).json({
      status: status === 500 ? 'error' : 'fail',
      message:
        status === 500
          ? 'Error interno del servidor'
          : (error as Error).message,
    });
  }
};