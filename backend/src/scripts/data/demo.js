// Datos de demostración: espacios y equipos de una institución educativa en Montevideo.

const PASSWORD_DEMO = 'Demo1234';

// reservas: cantidad a generar. cupos: combinaciones activas (solo plan plus).
const USUARIOS = [
  { username: 'luciafernandez', plan: 'plus', historicas: 0, cupos: [] },
  { username: 'martinsosa', plan: 'plus', historicas: 3, cupos: [2] },
  { username: 'valentinarodriguez', plan: 'plus', historicas: 3, cupos: [2, 2] },
  { username: 'diegopereira', plan: 'plus', historicas: 2, cupos: [3] },
  { username: 'joaquinsilva', plan: 'plus', historicas: 4, cupos: [1] },
  { username: 'camilagonzalez', plan: 'premium', reservas: 26 },
  { username: 'nicolasmartinez', plan: 'premium', reservas: 14 },
  { username: 'sofiaalvarez', plan: 'premium', reservas: 12 },
  { username: 'anaclarabenitez', plan: 'premium', reservas: 10 },
];

const CATEGORIAS = [
  { name: 'Salas de reunión', description: 'Espacios cerrados para reuniones de equipo y entrevistas.' },
  { name: 'Aulas', description: 'Salones para clases, talleres y presentaciones.' },
  { name: 'Proyectores', description: 'Equipos de proyección portátiles para aulas y salas.' },
  { name: 'Audio', description: 'Micrófonos, parlantes y grabadoras para eventos y clases.' },
  { name: 'Video y streaming', description: 'Cámaras y equipos para grabar o transmitir en vivo.' },
  { name: 'Computadoras', description: 'Notebooks y tablets para préstamo a estudiantes y docentes.' },
  { name: 'Fotografía', description: 'Cámaras, lentes e iluminación para trabajos audiovisuales.' },
  { name: 'Laboratorios', description: 'Espacios equipados para prácticas técnicas.' },
];

// [nombre, categoría, stock, descripción, estado (opcional)]
const RECURSOS = [
  ['Sala Rambla', 'Salas de reunión', 1, 'Sala para 8 personas con pantalla de 55 pulgadas y vista a la rambla.'],
  ['Sala Ciudad Vieja', 'Salas de reunión', 1, 'Sala para 12 personas con mesa ovalada y pizarra de vidrio.'],
  ['Sala Prado', 'Salas de reunión', 1, 'Sala chica para 4 personas, ideal para entrevistas.'],
  ['Sala Pocitos', 'Salas de reunión', 1, 'Sala para 6 personas con equipo de videoconferencia.'],
  ['Sala Cordón', 'Salas de reunión', 1, 'Sala para 10 personas en remodelación de mobiliario.', 'maintenance'],
  ['Aula 101', 'Aulas', 1, 'Aula para 30 personas con proyector fijo y aire acondicionado.'],
  ['Aula 102', 'Aulas', 1, 'Aula para 30 personas con pizarrón y sillas móviles.'],
  ['Aula 201', 'Aulas', 1, 'Aula para 45 personas con sonido integrado.'],
  ['Aula Magna', 'Aulas', 1, 'Auditorio para 120 personas con escenario y cabina de sonido.'],
  ['Proyector Epson PowerLite', 'Proyectores', 4, 'Proyector Full HD de 3400 lúmenes con cable HDMI.'],
  ['Proyector BenQ portátil', 'Proyectores', 3, 'Proyector liviano con batería propia y conexión inalámbrica.'],
  ['Proyector ViewSonic 4K', 'Proyectores', 1, 'Proyector 4K para presentaciones de alta definición.', 'maintenance'],
  ['Micrófono inalámbrico Shure', 'Audio', 6, 'Micrófono de mano con receptor y pilas recargables.'],
  ['Micrófono corbatero Rode', 'Audio', 5, 'Micrófono de solapa para entrevistas y clases grabadas.'],
  ['Parlante JBL EON', 'Audio', 2, 'Parlante activo de 1000 W con trípode.'],
  ['Grabadora Zoom H5', 'Audio', 3, 'Grabadora portátil de cuatro pistas para entrevistas.'],
  ['Consola Behringer 12 canales', 'Audio', 1, 'Mezcladora analógica fuera de uso hasta nuevo aviso.', 'inactive'],
  ['Cámara Sony PXW', 'Video y streaming', 2, 'Videocámara profesional con trípode y baterías.'],
  ['Kit de streaming Elgato', 'Video y streaming', 2, 'Capturadora, luz y soporte para transmisiones en vivo.'],
  ['Cámara web Logitech Brio', 'Video y streaming', 5, 'Cámara 4K para clases híbridas y videollamadas.'],
  ['Estabilizador DJI Ronin', 'Video y streaming', 1, 'Estabilizador de tres ejes para cámaras livianas.'],
  ['Notebook Lenovo ThinkPad', 'Computadoras', 10, 'Notebook de 14 pulgadas con 16 GB de RAM y Windows.'],
  ['MacBook Air', 'Computadoras', 4, 'Notebook para edición de imagen y video.'],
  ['Tablet Samsung Galaxy', 'Computadoras', 6, 'Tablet de 11 pulgadas con lápiz digital.'],
  ['Notebook Dell Latitude', 'Computadoras', 3, 'Notebook antigua retirada del préstamo.', 'inactive'],
  ['Cámara Canon EOS R50', 'Fotografía', 3, 'Cámara mirrorless con lente de 18 a 45 mm.'],
  ['Cámara Nikon D3500', 'Fotografía', 2, 'Cámara réflex ideal para cursos introductorios.'],
  ['Kit de iluminación LED', 'Fotografía', 3, 'Dos paneles LED regulables con trípodes.'],
  ['Fondo de estudio', 'Fotografía', 1, 'Estructura con fondos blanco, negro y verde.'],
  ['Laboratorio de Informática', 'Laboratorios', 1, 'Laboratorio con 25 computadoras y software de desarrollo.'],
  ['Laboratorio de Redes', 'Laboratorios', 1, 'Laboratorio con routers y switches para prácticas.'],
  ['Laboratorio de Impresión 3D', 'Laboratorios', 1, 'Tres impresoras 3D con filamento PLA.'],
];

module.exports = { PASSWORD_DEMO, USUARIOS, CATEGORIAS, RECURSOS };
