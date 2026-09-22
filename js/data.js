// ─── CONTENIDO EDITABLE DEL SITIO ───
// Edita aquí los datos que cambian seguido (grados, temas, horarios, disponibilidad).
// No necesitas tocar app.js ni index.html para actualizar esta información.

const gradesData = [
  {
    grade: '6°', label: 'Sexto',
    topics: ['Números enteros y naturales', 'Fracciones y decimales', 'Razones y proporciones', 'Geometría básica']
  },
  {
    grade: '7°', label: 'Séptimo',
    topics: ['Álgebra introductoria', 'Ecuaciones de primer grado', 'Geometría plana', 'Estadística básica']
  },
  {
    grade: '8°', label: 'Octavo',
    topics: ['Sistemas de ecuaciones', 'Factorización', 'Teorema de Pitágoras', 'Probabilidad']
  },
  {
    grade: '9°', label: 'Noveno',
    topics: ['Funciones y gráficas', 'Geometría analítica', 'Trigonometría básica', 'Polinomios']
  },
  {
    grade: '10°', label: 'Décimo',
    topics: ['Trigonometría avanzada', 'Logaritmos y exponenciales', 'Geometría del espacio', 'Progresiones']
  },
  {
    grade: '11°', label: 'Undécimo',
    topics: ['Precálculo', 'Límites e introducción al cálculo', 'Vectores', 'Combinatoria y probabilidad']
  }
];

// ─── CALENDARIO ───
const DAYS_ES = ['Lun','Mar','Mié','Jue','Vie','Sáb'];
const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const HOURS = ['7:00 AM','8:30 AM','10:00 AM','11:30 AM','2:00 PM','3:30 PM','5:00 PM','6:30 PM'];

// Patrón fijo de horas "ocupadas" por día de la semana (0=Lun ... 5=Sáb).
// Los números son índices sobre el arreglo HOURS.
// NOTA: esto es el mismo patrón cada semana, no es un calendario real compartido.
const BLOCKED = {
  0: [0,3,6], 1: [1,4], 2: [0,2,5,7], 3: [3,6], 4: [1,4,7], 5: [0,2,4,6]
};
