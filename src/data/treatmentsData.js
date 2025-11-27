// =================================================================================
// FILE: src/data/treatmentsData.js
// =================================================================================

// ============================================================================
// KNOWLEDGE BASE: Condiciones Dermatológicas y Tratamientos Asociados
// ============================================================================
export const dermatologyKnowledge = {
    skinConcerns: {
        manchas: {
            types: ["melasma", "hiperpigmentación postinflamatoria", "lentigos solares", "pecas"],
            causes: ["exposición solar", "cambios hormonales", "acné", "envejecimiento"],
            recommendedTreatments: ["Hollywood Peel", "Exosomas con Ácido Tranexámico"],
            contraindications: ["piel muy sensible activa", "infección activa"],
            expectedResults: "Reducción visible en 3-6 sesiones, mantenimiento cada 2-3 meses"
        },
        flacidez: {
            types: ["flacidez facial", "cuello", "papada", "contorno facial"],
            causes: ["pérdida de colágeno", "envejecimiento natural", "pérdida de peso"],
            recommendedTreatments: ["Hifu 12D", "Reducción de Papada con HIFU"],
            contraindications: ["embarazo", "marcapasos", "infección activa"],
            expectedResults: "Efecto tensor progresivo, resultados óptimos a los 3-6 meses"
        },
        arrugas: {
            types: ["líneas de expresión", "patas de gallo", "entrecejo", "frente"],
            causes: ["expresiones faciales repetitivas", "pérdida de colágeno", "exposición solar"],
            recommendedTreatments: ["Botox", "Exosomas con Ácido Tranexámico"],
            contraindications: ["embarazo", "lactancia", "enfermedades neuromusculares"],
            expectedResults: "Suavización visible en 3-7 días, duración 4-6 meses"
        },
        grasaLocalizada: {
            types: ["papada", "abdomen", "brazos", "muslos"],
            causes: ["genética", "estilo de vida", "metabolismo"],
            recommendedTreatments: ["Enzimas Recombinantes", "Reducción de Papada con Enzimas Recombinantes", "Reducción de Grasa Localizada"],
            contraindications: ["embarazo", "lactancia", "obesidad mórbida"],
            expectedResults: "Reducción gradual, resultados en 4-8 semanas"
        },
        micropigmentacion: {
            types: ["cejas deseadas", "labios deseados", "corrección de forma"],
            causes: ["necesidad estética", "alopecia de cejas", "labios pálidos"],
            recommendedTreatments: ["Micropigmentación de Cejas y Labios"],
            contraindications: ["embarazo", "lactancia", "infecciones activas", "queloides"],
            expectedResults: "Resultados inmediatos, duración 1-2 años"
        },
        borradoPigmentacion: {
            types: ["micropigmentación no deseada", "tatuajes"],
            causes: ["resultado no deseado", "cambio de gustos", "necesidad profesional"],
            recommendedTreatments: ["Borrado de Micropigmentación", "Borrado de Tatuajes"],
            contraindications: ["embarazo", "piel bronceada", "infección activa"],
            expectedResults: "Reducción progresiva, múltiples sesiones según profundidad"
        },
        envejecimiento: {
            types: ["envejecimiento global", "pérdida de luminosidad", "textura irregular"],
            causes: ["edad", "daño solar acumulado", "pérdida de colágeno"],
            recommendedTreatments: ["Exosomas con Ácido Tranexámico", "Hollywood Peel", "Hifu 12D"],
            contraindications: ["varían según tratamiento"],
            expectedResults: "Rejuvenecimiento progresivo con combinación de tratamientos"
        },
        cicatrices: {
            types: ["cicatrices de acné", "cicatrices quirúrgicas", "cicatrices atróficas", "estrías"],
            causes: ["acné severo", "cirugías", "traumatismos", "distensión de la piel"],
            recommendedTreatments: ["Dermapen con PRP", "Dermapen con Ácido Hialurónico", "Dermapen"],
            contraindications: ["infección activa", "queloides activos", "embarazo", "toma de isotretinoína"],
            expectedResults: "Mejora visible en 4-6 sesiones, resultados óptimos en 6-8 meses"
        },
        texturaIrregular: {
            types: ["poros dilatados", "piel rugosa", "textura desigual", "piel engrosada"],
            causes: ["producción excesiva de sebo", "edad", "daño solar", "falta de exfoliación"],
            recommendedTreatments: ["Dermapen", "Hollywood Peel", "Dermapen con Vitamina C"],
            contraindications: ["rosácea activa", "infección activa", "herpes activo"],
            expectedResults: "Refinamiento de textura en 3-5 sesiones, mantenimiento cada 2-3 meses"
        },
        porosAbiertos: {
            types: ["poros dilatados faciales", "piel grasa con poros visibles"],
            causes: ["genética", "producción excesiva de sebo", "pérdida de elasticidad"],
            recommendedTreatments: ["Dermapen", "Hollywood Peel"],
            contraindications: ["acné activo severo", "infección activa"],
            expectedResults: "Reducción visible de poros en 4-6 sesiones"
        }
    },

    treatmentCombinations: [
        {
            concern: "Envejecimiento avanzado con manchas y flacidez",
            protocol: ["Hifu 12D", "Exosomas con Ácido Tranexámico"],
            reasoning: "HIFU tensa la piel y estimula colágeno, mientras exosomas regeneran + aclaran manchas",
            sessionPlan: "Alternar tratamientos cada 3-4 semanas para resultados integrales"
        },
        {
            concern: "Arrugas de expresión + pérdida de luminosidad",
            protocol: ["Botox", "Hollywood Peel"],
            reasoning: "Botox suaviza arrugas dinámicas, Hollywood Peel ilumina y mejora textura",
            sessionPlan: "Botox cada 4-6 meses, Hollywood Peel mensual"
        },
        {
            concern: "Papada + flacidez facial",
            protocol: ["Reducción de Papada con HIFU", "Hifu 12D"],
            reasoning: "HIFU focalizado en papada + facial completo para armonía del rostro",
            sessionPlan: "Sesión combinada o escalonada según evaluación"
        },
        {
            concern: "Manchas resistentes + textura irregular",
            protocol: ["Exosomas con Ácido Tranexámico", "Hollywood Peel"],
            reasoning: "Exosomas trabajan a nivel celular + Hollywood Peel exfolia y aclara superficie",
            sessionPlan: "Exosomas cada 4 semanas, Hollywood Peel entre sesiones"
        },
        {
            concern: "Cicatrices de acné profundas",
            protocol: ["Dermapen con PRP"],
            reasoning: "PRP potencia la regeneración celular y el colágeno nuevo para rellenar cicatrices atróficas",
            sessionPlan: "4-6 sesiones cada 4 semanas, mantenimiento cada 3-6 meses"
        },
        {
            concern: "Textura irregular + poros abiertos + manchas leves",
            protocol: ["Dermapen con Vitamina C", "Hollywood Peel"],
            reasoning: "Dermapen con Vit C estimula colágeno y aclara, Hollywood Peel refina poros y exfolia",
            sessionPlan: "Alternar cada 3 semanas para sinergia completa"
        },
        {
            concern: "Líneas finas + deshidratación + pérdida de volumen facial",
            protocol: ["Dermapen con Ácido Hialurónico"],
            reasoning: "Microagujas permiten penetración profunda de ácido hialurónico para hidratar y rellenar",
            sessionPlan: "3-5 sesiones cada 3-4 semanas, resultados acumulativos"
        },
        {
            concern: "Rejuvenecimiento facial completo con cicatrices y manchas",
            protocol: ["Dermapen con PRP", "Exosomas con Ácido Tranexámico"],
            reasoning: "PRP regenera y repara cicatrices, Exosomas aclaran manchas y rejuvenecen globalmente",
            sessionPlan: "Protocolo de 6 meses alternando tratamientos cada 3-4 semanas"
        }
    ],

    professionalGuidelines: {
        whenToRecommendConsultation: [
            "Condiciones médicas que requieren diagnóstico (rosácea severa, dermatitis)",
            "Lesiones sospechosas o cambios en lunares",
            "Infecciones activas de la piel",
            "Historial de queloides o cicatrización anormal",
            "Embarazo o lactancia (para la mayoría de tratamientos)",
            "Enfermedades autoinmunes o tratamientos médicos activos"
        ],
        redFlags: [
            "Cambios recientes en lunares o lesiones",
            "Sangrado o secreción de la piel",
            "Dolor persistente sin causa aparente",
            "Picazón intensa y prolongada",
            "Cambios de color súbitos en la piel"
        ]
    }
};

// ============================================================================
// TREATMENTS DATA (Información completa de cada tratamiento)
// ============================================================================
export const treatmentsData = {
    "Borrado de Micropigmentación": {
        name: "Borrado de Micropigmentación",
        image: "/images/borrado-micropigmentacion.svg",
        description: "Elimina micropigmentaciones no deseadas de cejas o labios de forma segura y efectiva.",
        benefits: [
            "Resultados visibles desde la primera sesión",
            "Proceso seguro y controlado",
            "Sin daño a la piel circundante"
        ]
    },
    "Borrado de Tatuajes": {
        name: "Borrado de Tatuajes",
        image: "/images/borrado-tatuajes.svg",
        description: "Tecnología láser de última generación para eliminar tatuajes que ya no deseas.",
        benefits: [
            "Funciona en múltiples colores",
            "Mínimo riesgo de cicatrices",
            "Tratamiento personalizado según tipo de piel"
        ]
    },
    "Reducción de Papada": {
        name: "Reducción de Papada",
        image: "/images/reduccion-papada.svg",
        description: "Elimina la grasa localizada en la zona del mentón para un perfil más definido.",
        benefits: [
            "Resultados naturales y duraderos",
            "Sin cirugía ni incisiones",
            "Recuperación rápida"
        ]
    },
    "Hollywood Peel": {
        name: "Hollywood Peel",
        image: "/images/hollywood-peel.svg",
        description: "El tratamiento favorito de las celebridades para una piel luminosa y rejuvenecida al instante.",
        benefits: [
            "Piel radiante inmediata",
            "Reduce manchas y poros",
            "Sin tiempo de recuperación"
        ]
    },
    "Hifu 12D": {
        name: "HIFU 12D (Lifting sin Cirugía)",
        image: "/images/hifu-12d.svg",
        description: "Lifting facial no invasivo con ultrasonido para tensar y rejuvenecer la piel.",
        benefits: [
            "Efecto tensor inmediato",
            "Estimula producción de colágeno",
            "Resultados que mejoran con el tiempo"
        ]
    },
    "Enzimas Recombinantes": {
        name: "Enzimas Recombinantes",
        image: "/images/enzimas.svg",
        description: "Tratamiento innovador para reducción de grasa localizada mediante enzimas naturales.",
        benefits: [
            "Alternativa no quirúrgica",
            "Resultados progresivos y naturales",
            "Ideal para zonas rebeldes"
        ]
    },
    "Micropigmentación de Cejas y Labios": {
        name: "Micropigmentación de Cejas y Labios",
        image: "/images/micropigmentacion.svg",
        description: "Define y embellece tus cejas o labios de forma semipermanente con técnicas naturales.",
        benefits: [
            "Aspecto natural y personalizado",
            "Ahorra tiempo en tu rutina diaria",
            "Duración de 1-2 años"
        ]
    },
    "Reducción de Papada con HIFU": {
        name: "Reducción de Papada con HIFU",
        image: "/images/reduccion-papada.svg",
        description: "Tecnología HIFU especializada para contornear y definir la zona del mentón.",
        benefits: [
            "Sin agujas ni cirugía",
            "Perfil más estilizado",
            "Resultados visibles en semanas"
        ]
    },
    "Reducción de Papada con Enzimas Recombinantes": {
        name: "Reducción de Papada con Enzimas Recombinantes",
        image: "/images/enzimas.svg",
        description: "Tratamiento con enzimas que disuelve la grasa de la papada de forma natural.",
        benefits: [
            "Mínimamente invasivo",
            "Resultados graduales y naturales",
            "Sin tiempo de inactividad"
        ]
    },
    "Reducción de Grasa Localizada": {
        name: "Reducción de Grasa Localizada",
        image: "/images/grasa-localizada.svg",
        description: "Elimina depósitos de grasa en zonas específicas del cuerpo sin cirugía.",
        benefits: [
            "Tratamiento focalizado",
            "Sin anestesia general",
            "Resultados visibles en pocas sesiones"
        ]
    },
    "Exosomas con Ácido Tranexámico": {
        name: "Exosomas con Ácido Tranexámico",
        image: "/images/exosomas-acido-tranexamico.svg",
        description: "Tratamiento combinado de medicina regenerativa + antimanchas para rejuvenecimiento profundo y piel luminosa.",
        benefits: [
            "Regeneración celular + eliminación de manchas",
            "Unifica el tono y mejora la textura",
            "Reduce arrugas y líneas de expresión",
            "Piel más firme, luminosa y sin manchas"
        ]
    },
    "Botox": {
        name: "Botox (Toxina Botulínica)",
        image: "/images/botox.svg",
        description: "Tratamiento inyectable para suavizar arrugas de expresión y prevenir el envejecimiento facial.",
        benefits: [
            "Suaviza arrugas de frente, entrecejo y patas de gallo",
            "Efecto natural sin congelar la expresión",
            "Previene la formación de nuevas arrugas",
            "Resultados duran 4-6 meses"
        ]
    },
    "Dermapen": {
        name: "Dermapen (Microagujas)",
        image: "/images/dermapen.svg",
        description: "Tecnología de microagujas que estimula la producción natural de colágeno y elastina para renovar la piel desde adentro.",
        benefits: [
            "Mejora textura y suavidad de la piel",
            "Reduce poros abiertos visiblemente",
            "Unifica el tono de la piel",
            "Mínimo tiempo de recuperación (24-48h)"
        ]
    },
    "Dermapen con PRP": {
        name: "Dermapen con PRP (Plasma Rico en Plaquetas)",
        image: "/images/dermapen-prp.svg",
        description: "Combina microagujas con tu propio plasma rico en plaquetas para potenciar la regeneración celular y reducir cicatrices de acné.",
        benefits: [
            "Regeneración profunda de la piel",
            "Reduce cicatrices de acné de forma dramática",
            "Tratamiento 100% natural con tus propias células",
            "Resultados visibles y duraderos"
        ]
    },
    "Dermapen con Ácido Hialurónico": {
        name: "Dermapen con Ácido Hialurónico",
        image: "/images/dermapen-acido-hialuronico.svg",
        description: "Microagujas combinadas con ácido hialurónico de alta calidad para hidratar profundamente y rellenar líneas finas.",
        benefits: [
            "Hidratación profunda de la piel",
            "Rellena líneas finas y arrugas superficiales",
            "Mejora la elasticidad cutánea",
            "Piel más jugosa y luminosa"
        ]
    },
    "Dermapen con Vitamina C": {
        name: "Dermapen con Vitamina C",
        image: "/images/dermapen-vitamina-c.svg",
        description: "Microagujas con suero de vitamina C concentrado para iluminar, unificar el tono y combatir el envejecimiento.",
        benefits: [
            "Potente efecto antioxidante",
            "Ilumina y unifica el tono de la piel",
            "Estimula producción de colágeno",
            "Protección contra radicales libres"
        ]
    }
};

// Función para extraer tratamientos de la respuesta de Gemini
export const extractTreatmentsFromResponse = (geminiResponse) => {
    const treatments = [];
    const normalizedResponse = geminiResponse.toLowerCase();

    // Buscar nombres de tratamientos en negrita (**Nombre del Tratamiento**)
    const treatmentNames = Object.keys(treatmentsData);

    for (const treatmentName of treatmentNames) {
        // Verificar si el tratamiento está mencionado en la respuesta
        const normalizedTreatment = treatmentName.toLowerCase();

        if (normalizedResponse.includes(normalizedTreatment)) {
            treatments.push(treatmentsData[treatmentName]);
        }
    }

    // Si no se encontró ninguno, buscar por palabras clave
    if (treatments.length === 0) {
        if (normalizedResponse.includes('hifu') || normalizedResponse.includes('lifting')) {
            treatments.push(treatmentsData["Hifu 12D"]);
        }
        if (normalizedResponse.includes('hollywood') || normalizedResponse.includes('peel')) {
            treatments.push(treatmentsData["Hollywood Peel"]);
        }
        if (normalizedResponse.includes('papada')) {
            treatments.push(treatmentsData["Reduccion de papada"]);
        }
        if (normalizedResponse.includes('exosomas') || normalizedResponse.includes('tranexámico') || normalizedResponse.includes('tranexamico')) {
            treatments.push(treatmentsData["Exosomas con Ácido Tranexámico"]);
        }
        if (normalizedResponse.includes('botox') || normalizedResponse.includes('toxina botulínica') || normalizedResponse.includes('arrugas de expresión')) {
            treatments.push(treatmentsData["Botox"]);
        }
        if (normalizedResponse.includes('dermapen')) {
            // Detectar variantes específicas de Dermapen
            if (normalizedResponse.includes('prp') || normalizedResponse.includes('plasma')) {
                treatments.push(treatmentsData["Dermapen con PRP"]);
            } else if (normalizedResponse.includes('ácido hialurónico') || normalizedResponse.includes('acido hialuronico') || normalizedResponse.includes('hialurónico')) {
                treatments.push(treatmentsData["Dermapen con Ácido Hialurónico"]);
            } else if (normalizedResponse.includes('vitamina c')) {
                treatments.push(treatmentsData["Dermapen con Vitamina C"]);
            } else {
                treatments.push(treatmentsData["Dermapen"]);
            }
        }
        if (normalizedResponse.includes('microagujas') || normalizedResponse.includes('micro agujas')) {
            treatments.push(treatmentsData["Dermapen"]);
        }
    }

    return treatments;
};
