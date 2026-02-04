export const MOCK_COMPANY = {
  name: "Establecimiento Demo SRL",
  cuit: "30-71000000-9",
  address: "Av. Corrientes 1234, CABA",
  logo: "https://placehold.co/100x100/27C2B8/ffffff?text=ED",
  cct: "389/04",
  city: "CABA",
  province: "Buenos Aires",
  phone: "11 4455-6677"
};

export const DOCUMENT_CATEGORIES = [
  { id: 'ingreso', label: 'Ingreso & Registración', icon: 'UserPlus', docs: ['ficha_legajo', 'alta_arca', 'carta_ingreso'] },
  { id: 'disciplina', label: 'Disciplina & Sanciones', icon: 'AlertTriangle', docs: ['apercibimiento', 'suspension_disc', 'intimacion'] },
  { id: 'cartas', label: 'Cartas Documento', icon: 'Mail', docs: ['cd_abandono', 'cd_despido'] },
  { id: 'egreso', label: 'Desvinculación & Egreso', icon: 'UserMinus', docs: ['despido_causa', 'renuncia'] }
];

export const DOCUMENT_TEMPLATES = {
  ficha_legajo: {
    id: "ficha_legajo",
    title: "Ficha de Legajo y Declaración de Datos",
    category: "ingreso",
    risk_level: "low",
    version: "1.2",
    legal_basis: [
      { source: "LCT", ref: "Art. 21", text: "Deber de colaboración" }
    ],
    vars: [
      { key: "domicilio_real", label: "Domicilio Real", type: "text", required: true },
      { key: "telefono", label: "Teléfono de Contacto", type: "text", required: true },
      { key: "email", label: "Correo Electrónico", type: "email", required: false },
      { key: "jornada_descripcion", label: "Descripción de Jornada", type: "textarea", required: true }
    ],
    content: `Yo, {{nombre}} {{apellido}} (DNI {{dni}}, CUIL {{cuil}}), declaro bajo juramento que los datos consignados en esta ficha son veraces y me comprometo a informar fehacientemente cualquier cambio de domicilio y/o datos de contacto en un plazo de 48 hs. de producido el mismo.

Domicilio real: {{domicilio_real}}
Teléfono / email: {{telefono}} / {{email}}

Fecha de ingreso: {{fecha_ingreso}}
Establecimiento: {{establecimiento_nombre}} — Domicilio: {{domicilio_explotacion}}
Categoría/CCT: {{categoria_cct}} / {{cct_aplicable}}
Jornada/turno: {{jornada_descripcion}}

Se firma en prueba de conformidad. El trabajador recibe copia de la presente.`,
    footer: "Firma Trabajador: ____________________  Aclaración: ____________________  Fecha: {{fecha_emision}}"
  },
  apercibimiento: {
    id: "apercibimiento",
    title: "Apercibimiento / Llamado de Atención",
    category: "disciplina",
    risk_level: "medium",
    version: "2.0",
    legal_basis: [
      { source: "LCT", ref: "Art. 67", text: "Facultades disciplinarias" },
      { source: "LCT", ref: "Art. 68", text: "Límites a la facultad" }
    ],
    vars: [
      { key: "fecha_hecho", label: "Fecha del Hecho", type: "date", required: true },
      { key: "turno", label: "Turno / Horario", type: "text", required: true },
      { key: "motivo_cat", label: "Categoría de Falta", type: "select", options: ["Asistencia", "Puntualidad", "Conducta", "Procedimiento Operativo", "Uso de Uniforme"], required: true },
      { key: "detalle_hecho_objetivo", label: "Hechos Objetivos", type: "textarea", required: true, hint: "Describa qué ocurrió sin usar adjetivos subjetivos." },
      { key: "fuente_verificacion", label: "Cómo se verificó", type: "text", required: true, hint: "Ej: Reporte de reloj, Reporte de Supervisor X, Informe de Auditoría" }
    ],
    content: `En {{lugar}}, a los {{fecha_emision}}, se notifica a {{nombre}} {{apellido}} (DNI {{dni}}, CUIL {{cuil}}, Legajo {{legajo}}), que el día {{fecha_hecho}} en el turno {{turno}} y sector {{sector}}, se ha verificado el siguiente incumplimiento en materia de {{motivo_cat}}: {{detalle_hecho_objetivo}}.

Dicha conducta fue constatada mediante {{fuente_verificacion}}.

Se le requiere ajustar su conducta a las obligaciones de asistencia, puntualidad y cumplimiento de los procedimientos internos vigentes (Art. 62, 63 y concordantes LCT). Se deja constancia de que la reiteración de incumplimientos podrá dar lugar a medidas disciplinarias progresivas según la gravedad del caso.

Se informa al trabajador su derecho a realizar su descargo por escrito dentro de las próximas 48 horas.`,
    footer: `Manifestación / Descargo del Trabajador (Opcional):
__________________________________________________________________
__________________________________________________________________

Firma Empleador: ___________  Firma Trabajador (Acuse): ___________
La firma del trabajador implica sólo notificación/recepción, no conformidad.

En caso de negativa a firmar, se deja constancia con firma de dos testigos:
1. ____________________  2. ____________________`,
    warning: "La firma en acuse es fundamental. Si se niega, use el bloque de testigos."
  },
  suspension_disc: {
    id: "suspension_disc",
    title: "Notificación de Suspensión Disciplinaria",
    category: "disciplina",
    risk_level: "high",
    version: "2.1",
    legal_basis: [
      { source: "LCT", ref: "Art. 218", text: "Requisitos de validez" },
      { source: "LCT", ref: "Art. 220", text: "Plazo máximo" }
    ],
    vars: [
      { key: "cantidad_dias", label: "Días de Suspensión", type: "number", required: true, max: 30 },
      { key: "fecha_desde", label: "Fecha Inicio", type: "date", required: true },
      { key: "fecha_reintegro", label: "Fecha Reintegro", type: "date", required: true },
      { key: "motivo_claro", label: "Justa Causa (Hechos)", type: "textarea", required: true },
      { key: "fuente_verificacion", label: "Fuente de Verificación", type: "text", required: true }
    ],
    content: `En {{lugar}}, a los {{fecha_emision}}, se notifica a {{nombre}} {{apellido}} (DNI {{dni}}, CUIL {{cuil}}, Legajo {{legajo}}), que dadas las facultades disciplinarias del empleador, queda usted suspendido/a sin goce de haberes por el término de {{cantidad_dias}} día/s, a partir del {{fecha_desde}} inclusive.

Motivo de la medida: {{motivo_claro}}. 
Hecho verificado el día {{fecha_hecho}} mediante {{fuente_verificacion}}.

Se especifica que deberá reintegrarse el día {{fecha_reintegro}} en su horario habitual. Esta medida se fundamenta en su deber de colaboración y constituye una sanción proporcional ante la injuria laboral verificada.`,
    footer: `Firma Empleador: ___________  Firma Trabajador (Acuse): ___________
La firma del trabajador implica sólo notificación/recepción, no conformidad.

Testigos ante negativa a firmar:
1. ____________________  2. ____________________`,
    warning: "Atención: Las suspensiones no pueden exceder los 30 días anuales (Art. 220 LCT). Superado este tope, el trabajador puede considerarse despedido."
  },
  cd_abandono: {
    id: "cd_abandono",
    title: "Carta Documento - Abandono de Trabajo",
    category: "cartas",
    risk_level: "high",
    isTelegram: true,
    legal_basis: [
      { source: "LCT", ref: "Art. 244", text: "Abandono de trabajo" }
    ],
    vars: [
      { key: "fecha_inicio_ausencia", label: "Fecha inicio ausencia", type: "date", required: true }
    ],
    content: `ANTE SU AUSENCIA INJUSTIFICADA DESDE EL DÍA {{fecha_inicio_ausencia}}, INTIMAMOS PLAZO 48 HORAS SE REINTEGRE A SUS TAREAS HABITUALES BAJO APERCIBIMIENTO DE CONSIDERAR SU CONDUCTA COMO ABANDONO DE TRABAJO EN LOS TÉRMINOS DEL ART. 244 DE LA L.C.T. QUEDA USTED DEBIDAMENTE NOTIFICADO.`,
    warning: "Regla sugerida: Envío solo después de 48 hs. de incomparecencia sin aviso."
  }
};

export const MOCK_EMPLOYEES = [
  {
    id: "1",
    firstName: "Juan",
    lastName: "Pérez",
    dni: "30.123.456",
    cuil: "20-30123456-7",
    legajo: "L-102",
    sector: "Cocina",
    position: "Cocinero",
    entryDate: "2023-05-10",
    status: "active",
    address: "Calle Falsa 123, Bariloche",
    cct: "389/04",
    category: "Cocinero A",
    checklist: { dni: true, cuil: true, alta: true, apto: true, cuenta: false }
  },
  {
    id: "2",
    firstName: "María",
    lastName: "García",
    dni: "35.987.654",
    cuil: "27-35987654-2",
    legajo: "L-145",
    sector: "Recepción",
    position: "Recepcionista",
    entryDate: "2024-01-15",
    status: "active",
    address: "Av. Pioneros 456, Bariloche",
    cct: "389/04",
    category: "Recepcionista",
    checklist: { dni: true, cuil: true, alta: true, apto: true, cuenta: true }
  }
];

export const MOCK_DOCUMENTS = [
  {
    id: "DOC-2024-001",
    employeeId: "1",
    type: "ficha_legajo",
    date: "2023-05-10",
    status: "signed",
    creator: "Admin"
  }
];

export const HELP_ARTICLES = [
  {
    title: "¿Qué es el acuse de recibo?",
    content: "La firma en acuse de recibo es simplemente el reconocimiento de que se recibió el documento. No implica estar de acuerdo con el contenido. Es vital para la validez de las sanciones."
  },
  {
    title: "Límites a las suspensiones",
    content: "Según el Art. 220 de la LCT, las suspensiones por causas disciplinarias o falta/disminución de trabajo no pueden exceder los 30 días en un año, contados a partir de la primera suspensión."
  }
];
