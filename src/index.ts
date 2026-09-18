import {
  configuracionAgenda,
  arrayProfesionales,
  arrayEspecialidades,
  cargarDatos
} from "./resources.js";

await cargarDatos();

console.clear();

console.log("CONFIGURACION");
console.table(configuracionAgenda);

console.log("PROFESIONALES");
console.table(arrayProfesionales);

console.log("ESPECIALIDADES");
console.table(arrayEspecialidades);