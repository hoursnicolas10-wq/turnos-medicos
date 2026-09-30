import express from 'express';

import { cargarDatos } from './resources.ts';

import {
  obtenerEspecialidades,
  obtenerEspecialidadPorId,
  crearEspecialidad,
  eliminarEspecialidad,
} from './controllers/especialidades.controller.ts';

import {
  obtenerProfesionales,
  obtenerProfesionalPorId,
  crearProfesional,
  actualizarProfesional,
  eliminarProfesional,
} from './controllers/profesionales.controller.ts';

import {
  bienvenida,
  rutaNoEncontrada,
  manejarErrores,
} from './controllers/general.controller.ts';

const app = express();
const PORT = 3000;

// Permite recibir cuerpos JSON en las peticiones POST y PUT
app.use(express.json());

// ==========================================
// RUTA DE BIENVENIDA
// ==========================================
app.get('/', bienvenida);

// ==========================================
// RUTAS DE ESPECIALIDADES
// ==========================================
app.get('/api/especialidades', obtenerEspecialidades);
app.get('/api/especialidades/:id', obtenerEspecialidadPorId);
app.post('/api/especialidades', crearEspecialidad);
app.delete('/api/especialidades/:id', eliminarEspecialidad);

// ==========================================
// RUTAS DE PROFESIONALES
// ==========================================
app.get('/api/profesionales', obtenerProfesionales);
app.get('/api/profesionales/:id', obtenerProfesionalPorId);
app.post('/api/profesionales', crearProfesional);
app.put('/api/profesionales/:id', actualizarProfesional);
app.delete('/api/profesionales/:id', eliminarProfesional);

// ==========================================
// MIDDLEWARES FINALES (siempre al final)
// ==========================================

// 404 para rutas o métodos inexistentes
app.use(rutaNoEncontrada);

// Manejo global de errores (por ejemplo, JSON inválido)
app.use(manejarErrores);

// ==========================================
// INICIALIZACIÓN DEL SERVIDOR
// ==========================================
async function iniciarServidor(): Promise<void> {
  try {
    // Cargar los JSON en los arrays globales
    await cargarDatos();

    app.listen(PORT, () => {
      console.clear();
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log('✅ Datos iniciales cargados en memoria.');
      console.log('✅ API lista para recibir peticiones.');
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
}

iniciarServidor();