/**
 * Cuestionarios específicos por puesto
 * Cada puesto tiene preguntas personalizadas para evaluar mejor al candidato
 */

export const QUESTIONNAIRES = {
  "Editor de Videos": {
    title: "Cuestionario - Editor de Videos",
    description:
      "Responde las siguientes preguntas para completar tu postulación",
    questions: [
      {
        id: "experiencia_edicion",
        type: "select",
        question: "¿Cuántos años de experiencia tienes en edición de video?",
        options: ["Menos de 1 año", "1-2 años", "2-5 años", "Más de 5 años"],
      },
      {
        id: "software_principal",
        type: "text",
        question: "¿Cuál es tu software de edición principal?",
        placeholder: "Ej: Adobe Premiere, DaVinci Resolve, Final Cut Pro",
      },
      {
        id: "portafolio_url",
        type: "text",
        question:
          "URL de tu portafolio o ejemplos de trabajo (YouTube, Vimeo, etc)",
        placeholder: "https://...",
      },
      {
        id: "disponibilidad",
        type: "select",
        question: "¿Cuál es tu disponibilidad horaria?",
        options: ["Tiempo completo", "Medio tiempo", "Por proyectos/freelance"],
      },
      {
        id: "especialidad",
        type: "checkbox",
        question:
          "¿En cuál de estas áreas tienes experiencia? (Marca las que apliquen)",
        options: [
          "Edición de reels/cortos",
          "Edición de videos promocionales",
          "Efectos especiales",
          "Motion graphics",
          "Color grading",
          "Edición en vivo",
        ],
      },
    ],
  },

  "Especialista en Tratamientos Láser": {
    title: "Cuestionario - Especialista en Tratamientos Láser",
    description:
      "Responde las siguientes preguntas para completar tu postulación",
    questions: [
      {
        id: "experiencia_laser",
        type: "select",
        question: "¿Cuántos años de experiencia tienes con tratamientos láser?",
        options: ["Menos de 1 año", "1-2 años", "2-5 años", "Más de 5 años"],
      },
      {
        id: "certificaciones",
        type: "checkbox",
        question:
          "¿Qué certificaciones técnicas tienes? (Marca las que apliquen)",
        options: [
          "Certificación en Láser Diodo",
          "Certificación en Láser de CO2",
          "Certificación en Picosegundos",
          "Certificación en Radiofrequencia",
          "Certificación en Cuidados post-tratamiento",
        ],
      },
      {
        id: "tipos_tratamiento",
        type: "checkbox",
        question:
          "¿En cuál de estos tratamientos has trabajado? (Marca los que apliquen)",
        options: [
          "Depilación láser",
          "Rejuvenecimiento de piel",
          "Remoción de tatuajes",
          "Acné y cicatrices",
          "Manchas pigmentarias",
        ],
      },
      {
        id: "disponibilidad",
        type: "select",
        question: "¿Cuál es tu disponibilidad horaria?",
        options: ["Tiempo completo", "Medio tiempo", "Fines de semana"],
      },
      {
        id: "motivacion",
        type: "text",
        question: "¿Por qué te interesa trabajar con nosotros?",
        placeholder: "Cuéntanos brevemente...",
      },
    ],
  },

  "Practicante - Editor de Videos": {
    title: "Cuestionario - Practicante Editor de Videos",
    description:
      "Responde las siguientes preguntas para completar tu postulación",
    questions: [
      {
        id: "experiencia_basica",
        type: "select",
        question: "¿Tienes experiencia previa en edición de video?",
        options: [
          "No, es mi primer acercamiento",
          "Tengo conocimiento teórico",
          "He editado videos personales",
          "He realizado algunos proyectos",
        ],
      },
      {
        id: "software_conocidos",
        type: "text",
        question: "¿Qué softwares de edición conoces o has usado?",
        placeholder: "Ej: Adobe Premiere, DaVinci Resolve, CapCut",
      },
      {
        id: "razon_practicantia",
        type: "text",
        question: "¿Por qué te interesa esta practicantía?",
        placeholder: "Cuéntanos tu motivación...",
      },
      {
        id: "disponibilidad",
        type: "select",
        question: "¿Cuántas horas semanales puedes dedicar?",
        options: [
          "Menos de 10 horas",
          "10-20 horas",
          "20-30 horas",
          "Más de 30 horas",
        ],
      },
      {
        id: "disposicion_aprender",
        type: "select",
        question:
          "¿Tienes disposición de aprender nuevas herramientas y técnicas?",
        options: [
          "Totalmente, estoy muy motivado",
          "Sí, estoy interesado",
          "Depende del tema",
        ],
      },
    ],
  },

  "Practicante - Filmmaker": {
    title: "Cuestionario - Practicante Filmmaker",
    description:
      "Responde las siguientes preguntas para completar tu postulación",
    questions: [
      {
        id: "experiencia_filmmaking",
        type: "select",
        question:
          "¿Tienes experiencia previa en filmmaking/producción de video?",
        options: [
          "No, es nuevo para mí",
          "He trabajado en proyectos escolares",
          "He realizado videos independientes",
          "He trabajado en producciones profesionales",
        ],
      },
      {
        id: "habilidades_cinematografia",
        type: "checkbox",
        question:
          "¿En cuál de estas áreas tienes experiencia? (Marca las que apliquen)",
        options: [
          "Manejo de cámara",
          "Iluminación",
          "Sonido",
          "Composición de planos",
          "Dirección de actores",
          "Producción general",
        ],
      },
      {
        id: "disponibilidad_rodajes",
        type: "select",
        question: "¿Tienes disponibilidad para rodajes/salidas de campo?",
        options: [
          "Sí, disponible entre semana",
          "Sí, disponible fines de semana",
          "Disponible ambos",
          "Limitada disponibilidad",
        ],
      },
      {
        id: "equipo_propio",
        type: "select",
        question: "¿Cuentas con equipo de filmmaking propio?",
        options: [
          "Sí, tengo equipo completo",
          "Tengo equipo básico",
          "No tengo equipo",
          "Podría conseguir equipo",
        ],
      },
      {
        id: "motivacion_filmaking",
        type: "text",
        question: "¿Qué te atrae del filmmaking como carrera?",
        placeholder: "Comparte tu perspectiva...",
      },
    ],
  },

  "Cosmiatra": {
    title: "Cuestionario - Cosmiatra",
    description:
      "Responde las siguientes preguntas para completar tu postulación",
    questions: [
      {
        id: "formacion_estetica",
        type: "select",
        question: "¿Tienes formación en cosmiatría, estética o áreas afines?",
        options: [
          "Sí, tengo título técnico o universitario",
          "Sí, tengo cursos o certificaciones",
          "Estoy estudiando actualmente",
          "No tengo formación formal pero tengo experiencia práctica",
        ],
      },
      {
        id: "procedimientos",
        type: "checkbox",
        question:
          "¿Cuáles de estos procedimientos has realizado alguna vez? (Marca los que apliquen)",
        options: [
          "Limpieza facial / hidratación",
          "Masajes / drenaje linfático",
          "Peeling o exfoliación",
          "Depilación",
          "Maquillaje profesional",
          "Ninguno aún, pero estoy dispuesta/o a aprender",
        ],
      },
      {
        id: "experiencia_ventas",
        type: "select",
        question: "¿Tienes experiencia en atención al cliente o ventas?",
        options: [
          "Sí, en clínica estética o spa",
          "Sí, en otro rubro (retail, servicios, etc.)",
          "Poca experiencia, pero me manejo bien con personas",
          "No tengo experiencia en ventas aún",
        ],
      },
      {
        id: "habilidad_venta",
        type: "select",
        question:
          "¿Cómo describirías tu habilidad para recomendar o vender servicios a un cliente?",
        options: [
          "Muy buena, me resulta natural",
          "Buena, lo he practicado antes",
          "Regular, pero estoy dispuesta/o a mejorar",
          "Aún no lo he desarrollado pero me interesa aprender",
        ],
      },
      {
        id: "enfoque_venta",
        type: "text",
        question:
          "Si una clienta viene solo por una limpieza facial, ¿cómo le ofrecerías un tratamiento adicional?",
        placeholder:
          "Cuéntanos cómo lo abordarías en pocas palabras...",
      },
    ],
  },

  "Asesor Comercial": {
    title: "Cuestionario - Asesor Comercial",
    description:
      "Responde las siguientes preguntas para completar tu postulación",
    questions: [
      {
        id: "experiencia_ventas",
        type: "select",
        question:
          "¿Cuántos años de experiencia tienes en ventas o asesoría comercial?",
        options: ["Menos de 1 año", "1-2 años", "2-5 años", "Más de 5 años"],
      },
      {
        id: "sector_experiencia",
        type: "text",
        question:
          "¿En qué sectores has trabajado? (Ej: Retail, Servicios, Telemarketing)",
        placeholder: "Especifica los sectores...",
      },
      {
        id: "habilidades_clave",
        type: "checkbox",
        question:
          "¿Cuál de estas habilidades dominas? (Marca las que apliquen)",
        options: [
          "Cierre de ventas",
          "Atención al cliente",
          "Negociación",
          "Prospección de clientes",
          "Manejo de CRM",
          "Trabajo en equipo",
          "Presentaciones comerciales",
        ],
      },
      {
        id: "modalidad_trabajo",
        type: "select",
        question: "¿Prefieres trabajar de manera?",
        options: [
          "Presencial en clínica",
          "Telemarketing/llamadas",
          "Mixta (ambas)",
        ],
      },
      {
        id: "meta_ventas",
        type: "text",
        question:
          "¿Cuál fue tu mejor logro de ventas o conversiones en un mes?",
        placeholder: "Comparte tu mejor resultado...",
      },
    ],
  },
};

/**
 * Obtener cuestionario por nombre de puesto
 */
export const getQuestionnaire = (nombrePuesto) => {
  return QUESTIONNAIRES[nombrePuesto] || null;
};

/**
 * Validar respuestas del cuestionario
 */
export const validateQuestionnaireAnswers = (questionnaire, answers) => {
  const errors = {};

  questionnaire.questions.forEach((question) => {
    const answer = answers[question.id];

    // Validación básica: todos los campos requeridos deben tener respuesta
    if (
      !answer ||
      (typeof answer === "string" && answer.trim() === "") ||
      (Array.isArray(answer) && answer.length === 0)
    ) {
      errors[question.id] = `${question.question} es requerida`;
    }
  });

  return errors;
};
