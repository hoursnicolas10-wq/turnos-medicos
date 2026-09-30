import type { IEspecialidad, IProfesional } from '../resources.ts';

// Limpia la consola y muestra el estado actualizado de un recurso
export function mostrarTablaRecurso(
  titulo: string,
  datos: IEspecialidad[] | IProfesional[]
): void {
  console.clear();
  console.log(`=== ${titulo.toUpperCase()} ===`);
  console.table(datos);
}