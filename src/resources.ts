import { readFile } from 'node:fs/promises';
import path from 'node:path';

// --- INTERFACES DEL DOMINIO ---

export interface IEspecialidad {
  especialidadId: string;
  nombreEspecialidad: string;
  activa: boolean;
}

export interface IProfesional {
  medicoId: string;
  nombre: string;
  especialidad: string;
  activo: boolean;
}

export interface IConfiguracionAgenda {
  fechaMaxima: string;
  horaMinima: string;
  horaMaxima: string;
}

// --- CONFIGURACIÓN Y ARRAYS GLOBALES ---

export const configuracionAgenda: IConfiguracionAgenda = {
  fechaMaxima: '2026-12-30',
  horaMinima: '07:00',
  horaMaxima: '13:00',
};

export let arrayEspecialidades: IEspecialidad[] = [];
export let arrayProfesionales: IProfesional[] = [];

// --- CARGA ASÍNCRONA DE DATOS ---

export async function cargarDatos(): Promise<void> {
  try {
    const rutaEspecialidades = path.join(
      process.cwd(),
      'src',
      'data',
      'especialidades.json'
    );

    const rutaProfesionales = path.join(
      process.cwd(),
      'src',
      'data',
      'profesionales.json'
    );

    const dataEspecialidades = await readFile(
      rutaEspecialidades,
      'utf-8'
    );

    const dataProfesionales = await readFile(
      rutaProfesionales,
      'utf-8'
    );

    arrayEspecialidades = JSON.parse(dataEspecialidades);
    arrayProfesionales = JSON.parse(dataProfesionales);
  } catch (error) {
    console.error('❌ Error al cargar los archivos JSON:', error);
  }
}
export type Especialidad = {
    especialidadId: number,
    nombreEspecialidad:string,
    activa: boolean
  }
