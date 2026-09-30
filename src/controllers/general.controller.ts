import type { NextFunction, Request, Response } from 'express';

// GET /
// Endpoint de bienvenida (Hello World)
export const bienvenida = async (req: Request, res: Response) => {
  let status: number = 200;

  try {
    return res.status(status).json({
      status: 'success',
      message: '¡Hola! Bienvenido a la API REST de TurnosMed',
    });
  } catch (error) {
    status = 500;
    console.error('Error en el endpoint de bienvenida:', error);

    return res.status(status).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
};

// Middleware final: rutas o métodos no contemplados por la API
export const rutaNoEncontrada = async (req: Request, res: Response) => {
  let status: number = 404;

  try {
    throw new Error(
      `La ruta o método '${req.method} ${req.originalUrl}' no existe en esta API REST.`
    );
  } catch (error) {
    return res.status(status).json({
      status: 'fail',
      message: (error as Error).message,
    });
  }
};

// Middleware de errores globales (por ejemplo, JSON mal formado en el body)
export const manejarErrores = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      status: 'fail',
      message: 'El cuerpo de la petición no es un JSON válido',
    });
  }

  console.error('Error no controlado:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
  });
};