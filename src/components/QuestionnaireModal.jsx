import React, { useState, useEffect } from 'react';
import { validateQuestionnaireAnswers } from '../data/questionnairesData';

/**
 * Modal de Cuestionario Dinámico
 * Renderiza preguntas según el puesto y captura respuestas
 */
const QuestionnaireModal = ({
  isOpen,
  questionnaire,
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  // Inicializar respuestas cuando se abre el modal
  useEffect(() => {
    if (isOpen && questionnaire) {
      const initialAnswers = {};
      questionnaire.questions.forEach(q => {
        if (q.type === 'checkbox') {
          initialAnswers[q.id] = [];
        } else {
          initialAnswers[q.id] = '';
        }
      });
      setAnswers(initialAnswers);
      setErrors({});
      setCurrentStep(0);
    }
  }, [isOpen, questionnaire]);

  if (!isOpen || !questionnaire) return null;

  const totalQuestions = questionnaire.questions.length;
  const currentQuestion = questionnaire.questions[currentStep];
  const progress = ((currentStep + 1) / totalQuestions) * 100;

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Limpiar error al cambiar respuesta
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (questionId, option) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      const isChecked = currentAnswers.includes(option);
      return {
        ...prev,
        [questionId]: isChecked
          ? currentAnswers.filter(a => a !== option)
          : [...currentAnswers, option]
      };
    });
    // Limpiar error al cambiar respuesta
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    // Validar respuesta actual
    const currentAnswer = answers[currentQuestion.id];
    let hasError = false;

    if (!currentAnswer || (typeof currentAnswer === 'string' && currentAnswer.trim() === '') || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
      setErrors(prev => ({
        ...prev,
        [currentQuestion.id]: 'Esta pregunta es requerida'
      }));
      hasError = true;
    }

    if (!hasError) {
      if (currentStep < totalQuestions - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todas las respuestas
    const validationErrors = validateQuestionnaireAnswers(questionnaire, answers);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Enviar respuestas
    onSubmit(answers);
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'text':
        return (
          <div className="mb-6">
            <input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder={currentQuestion.placeholder}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors[currentQuestion.id] ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-pink-400'
              }`}
            />
          </div>
        );

      case 'select':
        return (
          <div className="mb-6">
            <select
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition appearance-none bg-white ${
                errors[currentQuestion.id] ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-pink-400'
              }`}
            >
              <option value="">Selecciona una opción...</option>
              {currentQuestion.options.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      case 'checkbox':
        return (
          <div className="mb-6 space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <label key={idx} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                <input
                  type="checkbox"
                  checked={(answers[currentQuestion.id] || []).includes(option)}
                  onChange={() => handleCheckboxChange(currentQuestion.id, option)}
                  className="w-4 h-4 text-pink-500 rounded focus:ring-2 focus:ring-pink-500"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 border-b">
          <h2 className="text-2xl font-bold mb-2">{questionnaire.title}</h2>
          <p className="text-pink-100 mb-4">{questionnaire.description}</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-pink-200 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-pink-100 mt-2">
            Pregunta {currentStep + 1} de {totalQuestions}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Question */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              {currentQuestion.question}
            </label>
            {renderQuestion()}
            {errors[currentQuestion.id] && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 14.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
                </svg>
                {errors[currentQuestion.id]}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-12">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Atrás
            </button>

            {currentStep < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 px-4 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Postulación'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionnaireModal;
