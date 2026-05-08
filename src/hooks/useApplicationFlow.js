/**
 * Hook personalizado para manejar el flujo de postulación en dos pasos
 * Paso 1: Formulario de postulación
 * Paso 2: Cuestionario específico del puesto
 * Paso 3: Envío a n8n
 */

import { useState } from "react";
import { getQuestionnaire } from "../data/questionnairesData";

export const useApplicationFlow = () => {
  // Estado del flujo
  const [applicationStep, setApplicationStep] = useState(1); // 1 = formulario, 2 = cuestionario, 3 = enviando
  const [postulationData, setPostulationData] = useState(null);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState(null);

  /**
   * Avanzar al cuestionario después de validar el formulario
   */
  const proceedToQuestionnaire = (formData, nombrePuesto) => {
    // Validar que el nombre del puesto tenga cuestionario
    const questionnaire = getQuestionnaire(nombrePuesto);
    if (!questionnaire) {
      console.warn(`No hay cuestionario para: ${nombrePuesto}`);
      return false;
    }

    // Guardar datos de postulación y avanzar
    setPostulationData({
      ...formData,
      nombrePuesto,
    });
    setApplicationStep(2);
    return true;
  };

  /**
   * Enviar postulación después de completar el cuestionario
   */
  const submitApplication = async (answers, webhookUrl) => {
    if (!postulationData || !answers) {
      console.error("Datos incompletos para enviar");
      return { success: false, error: "Datos incompletos" };
    }

    setApplicationStep(3);

    try {
      // Combinar datos de postulación + respuestas del cuestionario
      const formDataPayload = new FormData();

      // Datos personales
      formDataPayload.append("nombre", postulationData.nombre);
      formDataPayload.append("apellido", postulationData.apellido);
      formDataPayload.append("telefono", postulationData.telefono);
      formDataPayload.append("email", postulationData.email);
      formDataPayload.append("dni", postulationData.dni);
      formDataPayload.append("ciudad", postulationData.ciudad);
      formDataPayload.append("país", postulationData.país);

      // CV (si existe)
      if (postulationData.curriculum instanceof File) {
        formDataPayload.append("curriculum", postulationData.curriculum);
      }

      // Información de la postulación
      formDataPayload.append("puesto", postulationData.nombrePuesto);
      formDataPayload.append("landing_url", window.location.href);
      formDataPayload.append("timestamp", new Date().toISOString());

      // Respuestas del cuestionario (como JSON stringificado)
      formDataPayload.append(
        "respuestas_cuestionario",
        JSON.stringify(answers),
      );

      // Datos de tracking UTM (si existen)
      if (postulationData.utmData) {
        const trackingFields = [
          "ttclid",
          "fbclid",
          "ad_id",
          "adset_id",
          "campaign_id",
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_content",
          "utm_term",
        ];
        trackingFields.forEach((field) => {
          formDataPayload.append(field, postulationData.utmData[field] || "");
        });
      }

      console.log("📤 Enviando postulación completa a:", webhookUrl);

      // Enviar a webhook
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(webhookUrl, {
        method: "POST",
        body: formDataPayload,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log("✅ Postulación enviada exitosamente");
        setQuestionnaireAnswers(answers);
        return { success: true };
      } else {
        const errorText = await response.text();
        console.error("❌ Error del servidor:", response.status, errorText);
        return {
          success: false,
          error: `Error del servidor: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("❌ Error enviando postulación:", error);

      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Tiempo de espera agotado. Por favor, intenta nuevamente.",
        };
      }

      return {
        success: false,
        error: "Error de conexión. Verifica tu internet e intenta nuevamente.",
      };
    }
  };

  /**
   * Reiniciar el flujo
   */
  const resetFlow = () => {
    setApplicationStep(1);
    setPostulationData(null);
    setQuestionnaireAnswers(null);
  };

  /**
   * Volver a la postulación (para editar)
   */
  const backToApplication = () => {
    setApplicationStep(1);
  };

  return {
    applicationStep,
    postulationData,
    questionnaireAnswers,
    proceedToQuestionnaire,
    submitApplication,
    resetFlow,
    backToApplication,
  };
};

export default useApplicationFlow;
