# Agente Experto en Dermatología - DermicaPro

## Descripción General

La **Dra. Virtual de DermicaPro** es un agente de IA especializado en dermatología estética que funciona como asesora experta para los usuarios del sitio web. Este sistema combina conocimiento dermatológico estructurado con la capacidad de razonamiento avanzado de Google Gemini AI para proporcionar recomendaciones personalizadas y basadas en evidencia.

---

## Características Principales

### 1. Base de Conocimiento Dermatológico

El agente cuenta con una base de conocimiento estructurada que incluye:

#### **Condiciones de Piel Categorizadas:**
- **Manchas**: Melasma, hiperpigmentación, lentigos solares
- **Flacidez**: Facial, cuello, papada, pérdida de contorno
- **Arrugas**: Líneas de expresión, patas de gallo, entrecejo
- **Grasa Localizada**: Papada, abdomen, brazos, muslos
- **Micropigmentación**: Cejas, labios, correcciones
- **Borrado de Pigmentación**: Micropigmentación no deseada, tatuajes
- **Envejecimiento Global**: Pérdida de luminosidad, textura irregular

#### **Para cada condición se incluye:**
- **Types**: Variaciones específicas de la condición
- **Causes**: Causas subyacentes desde perspectiva dermatológica
- **Recommended Treatments**: Tratamientos de DermicaPro aplicables
- **Contraindications**: Situaciones en las que NO es apropiado
- **Expected Results**: Expectativas realistas de tiempo y resultados

---

### 2. Protocolos de Combinación de Tratamientos

El agente puede recomendar **combinaciones estratégicas** para casos complejos:

| **Caso** | **Protocolo** | **Razonamiento** |
|----------|---------------|------------------|
| Envejecimiento + Manchas + Flacidez | HIFU 12D + Exosomas con Ácido Tranexámico | HIFU tensa y estimula colágeno, Exosomas regeneran + aclaran |
| Arrugas de expresión + Pérdida de luminosidad | Botox + Hollywood Peel | Botox suaviza arrugas, Hollywood Peel ilumina textura |
| Papada + Flacidez facial | Reducción de Papada HIFU + HIFU 12D facial | Tratamiento focalizado + integral para armonía |
| Manchas resistentes + Textura | Exosomas + Hollywood Peel | Exosomas a nivel celular + Hollywood Peel en superficie |

---

### 3. Sistema de Prompt Engineering Avanzado

El agente utiliza un **prompt estructurado** con 5 secciones:

#### **1. Validación Empática (2-3 líneas)**
Reconoce la emoción y valida la preocupación del usuario.

*Ejemplo:*
> "Entiendo perfectamente tu frustración con las manchas que parecen resistirse a todo. Es común sentirse desanimada, pero con la tecnología adecuada, hay soluciones reales."

#### **2. Análisis Dermatológico (1 párrafo)**
Explica QUÉ está pasando en la piel desde la perspectiva científica.

*Ejemplo:*
> "Las manchas como el melasma ocurren cuando los melanocitos se sobreestimulan por factores como el sol o cambios hormonales. La clave está en tratamientos que regulen esta producción desde la raíz."

#### **3. Recomendación de Tratamiento (Máximo 2)**
- Casos simples → 1 tratamiento específico
- Casos complejos → Combinación de 2 tratamientos + plan escalonado
- Formato con **Nombre en Negrita**
- Explica MECANISMO DE ACCIÓN en lenguaje simple
- Enfoca en RESULTADOS EMOCIONALES
- Incluye EXPECTATIVAS REALISTAS

#### **4. Plan de Acción (bullets)**
- Número aproximado de sesiones
- Frecuencia recomendada
- Qué esperar en cada fase
- Cuidados complementarios (si aplica)

#### **5. Cierre Empoderador (1-2 líneas)**
Mensaje inspirador + invitación a evaluación personalizada.

*Ejemplo:*
> "Recuerda que cada piel es única. Una evaluación presencial nos permitirá diseñar el protocolo perfecto para ti. ¡Estás a un paso de la piel que mereces!"

---

## Reglas Estrictas del Agente

### ✅ **SIEMPRE:**
- Usa la base de conocimiento para razonar sobre situaciones nuevas
- Recomienda SOLO tratamientos de la lista oficial de DermicaPro
- Considera combinaciones cuando el caso lo amerite
- Sé honesta si un tratamiento tiene limitaciones
- Deriva a consulta médica si detectas señales de alerta

### ❌ **NUNCA:**
- Inventes tratamientos que no existen en la lista
- Uses más de 2 tratamientos por recomendación
- Prometas resultados "mágicos" o "instantáneos"
- Diagnostiques condiciones médicas (solo recomiendas tratamientos estéticos)
- Uses jerga técnica sin explicarla

---

## Señales de Alerta (Red Flags)

El agente está programado para **derivar a consulta médica** cuando detecta:

- Cambios recientes en lunares o lesiones
- Sangrado o secreción de la piel
- Dolor persistente sin causa aparente
- Picazón intensa y prolongada
- Cambios de color súbitos en la piel
- Infecciones activas de la piel
- Embarazo o lactancia (para mayoría de tratamientos)
- Condiciones que requieren diagnóstico (rosácea severa, dermatitis)

---

## Ejemplo de Flujo de Interacción

### **Usuario escribe:**
> "Tengo 42 años y me siento muy frustrada. Tengo manchas oscuras en las mejillas que empeoran con el sol, y también noto que mi piel está flácida, especialmente en la papada. Quiero verme mejor pero sin cirugía."

### **Agente responde:**

**[1. Validación Empática]**
> "Entiendo perfectamente tu frustración, y es completamente válido querer recuperar la luminosidad y firmeza de tu piel. La buena noticia es que la medicina estética moderna ofrece soluciones no quirúrgicas muy efectivas para ambas preocupaciones."

**[2. Análisis Dermatológico]**
> "Lo que estás experimentando es común a partir de los 40: el melasma (manchas por estímulo hormonal/solar) se combina con pérdida de colágeno que causa flacidez. Ambas condiciones responden muy bien a tratamientos especializados que trabajan a diferentes niveles de la piel."

**[3. Recomendación de Tratamiento]**
> "Para tu caso, recomiendo un protocolo combinado:
>
> **HIFU 12D (Lifting sin Cirugía)**
> Este tratamiento usa ultrasonido focalizado para tensar la piel y estimular la producción natural de colágeno. Es perfecto para papada y flacidez facial, con resultados que mejoran progresivamente durante 3-6 meses. Te dará ese efecto lifting sin bisturí.
>
> **Exosomas con Ácido Tranexámico**
> Combina medicina regenerativa celular con el poder antimanchas del ácido tranexámico. Mientras los exosomas rejuvenecen la piel desde dentro, el ácido tranexámico trabaja específicamente en reducir esas manchas que tanto te molestan."

**[4. Plan de Acción]**
> • **HIFU 12D**: 1 sesión inicial, resultados progresivos hasta 6 meses
> • **Exosomas**: 3-4 sesiones cada 4 semanas para manchas
> • **Plan escalonado**: Alternar tratamientos para resultados integrales
> • **Cuidado complementario**: Protector solar SPF 50+ diario (esencial para mantener resultados antimanchas)

**[5. Cierre Empoderador]**
> "Estás tomando la decisión correcta al buscar alternativas no quirúrgicas. Con este protocolo, verás mejoras notables tanto en firmeza como en tono de piel. ¡Una evaluación presencial nos permitirá personalizar aún más el plan perfecto para ti!"

---

## Tratamientos Disponibles en la Base de Datos

1. **Borrado de Micropigmentación**
2. **Borrado de Tatuajes**
3. **Reducción de Papada**
4. **Hollywood Peel**
5. **HIFU 12D (Lifting sin Cirugía)**
6. **Enzimas Recombinantes**
7. **Micropigmentación de Cejas y Labios**
8. **Reducción de Papada con HIFU**
9. **Reducción de Papada con Enzimas Recombinantes**
10. **Reducción de Grasa Localizada**
11. **Exosomas con Ácido Tranexámico**
12. **Botox (Toxina Botulínica)**
13. **Dermapen (Microagujas)**
14. **Dermapen con PRP (Plasma Rico en Plaquetas)**
15. **Dermapen con Ácido Hialurónico**
16. **Dermapen con Vitamina C**

---

## Integración Técnica

### **Archivos Clave:**

- **`/src/data/treatmentsData.js`**: Base de conocimiento dermatológico + datos de tratamientos
- **`/src/components/GeminiSkinAdvisor.jsx`**: Componente principal del agente con prompt avanzado
- **`/src/components/TreatmentSelectionModal.jsx`**: Modal visual para tratamientos recomendados

### **API Utilizada:**

- **Google Gemini AI** (modelo: `gemini-2.5-flash`)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

### **Flujo de Datos:**

1. Usuario ingresa preocupación en textarea
2. Sistema construye prompt con base de conocimiento + consulta del usuario
3. Se envía a Gemini AI para procesamiento
4. IA genera respuesta siguiendo protocolo de 5 secciones
5. Sistema extrae tratamientos mencionados usando función `extractTreatmentsFromResponse()`
6. Se muestra análisis + botón para ver tratamientos visuales
7. Modal `TreatmentSelectionModal` permite explorar tratamientos con imágenes y detalles

---

## Ventajas del Nuevo Sistema

### **Antes (Simple Advisor):**
- ❌ Respuestas genéricas
- ❌ Sin contexto dermatológico
- ❌ No podía razonar sobre casos complejos
- ❌ Sin combinaciones de tratamientos
- ❌ Tono básico

### **Ahora (Expert Agent):**
- ✅ Respuestas personalizadas con análisis dermatológico
- ✅ Base de conocimiento estructurada sobre condiciones de piel
- ✅ Razonamiento sobre situaciones nuevas y complejas
- ✅ Recomendación inteligente de combinaciones de tratamientos
- ✅ Tono profesional y empático de experta
- ✅ Expectativas realistas de tiempo y resultados
- ✅ Sistema de red flags para derivar a consulta médica
- ✅ Educación al usuario sobre causas y mecanismos

---

## Mantenimiento y Evolución

### **Agregar nuevos tratamientos:**

1. Actualizar `treatmentsData` con información completa del tratamiento
2. Agregar el nombre a `servicesList` en `GeminiSkinAdvisor.jsx`
3. Evaluar si aplica para alguna categoría en `dermatologyKnowledge.skinConcerns`
4. Considerar si puede ser parte de un `treatmentCombinations` nuevo

### **Mejorar el agente:**

- Analizar conversaciones reales de usuarios
- Identificar patrones de consultas no cubiertas
- Expandir `dermatologyKnowledge` con nuevas condiciones
- Afinar el prompt basado en feedback
- Agregar más protocolos de combinación según casos comunes

---

## Mejores Prácticas

1. **Monitorear conversaciones** para detectar situaciones mal manejadas
2. **Educar al usuario** siempre, no solo vender tratamientos
3. **Ser honesta** sobre limitaciones y expectativas
4. **Derivar apropiadamente** cuando se detectan señales de alerta
5. **Mantener actualizada** la base de conocimiento con nuevos tratamientos
6. **Testear regularmente** con casos edge para validar razonamiento

---

## Contacto para Mejoras

Para sugerencias de mejora del agente o reporte de casos mal manejados, documentar en:
- Issues de GitHub del proyecto
- Reuniones de revisión de producto
- Feedback directo del equipo médico de DermicaPro

---

**Última actualización:** 2025-11-27
**Versión del agente:** 2.0 (Expert Dermatology Agent)
**Modelo de IA:** Google Gemini 2.5 Flash
