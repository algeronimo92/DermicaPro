// =================================================================================
// FILE: src/pages/PoliticaPrivacidadPage.jsx
// =================================================================================
import React from "react";
import { Helmet } from "react-helmet-async";

const PoliticaPrivacidadPage = () => {
  return (
    <div className="bg-gray-50 pt-24 pb-16 animate-fade-in">
      <Helmet>
        <title>Política de Privacidad | DermicaPro</title>
        <meta
          name="description"
          content="Política de privacidad de DermicaPro. Conoce cómo protegemos y utilizamos tus datos personales."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://dermicapro.com/politica-privacidad" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Política de Privacidad
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Última actualización: 27 de noviembre de 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white p-8 rounded-lg shadow-lg space-y-8">

          {/* Introducción */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introducción
            </h2>
            <p className="text-gray-700 leading-relaxed">
              En <strong>DermicaPro</strong>, respetamos tu privacidad y nos comprometemos a proteger
              tus datos personales. Esta Política de Privacidad explica qué información recopilamos,
              cómo la usamos, y tus derechos sobre ella.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Al utilizar nuestro sitio web (<strong>dermicapro.com</strong>) y nuestros servicios,
              aceptas las prácticas descritas en esta política.
            </p>
          </section>

          {/* Información que Recopilamos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Información que Recopilamos
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              2.1 Información Personal que Proporcionas
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Cuando reservas una cita, contactas con nosotros o usas nuestro Asesor Virtual,
              recopilamos información como:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Nombre completo</strong></li>
              <li><strong>Número de teléfono / WhatsApp</strong></li>
              <li><strong>Correo electrónico</strong></li>
              <li><strong>Tratamiento de interés</strong> (opcional)</li>
              <li><strong>Consultas sobre problemas de piel</strong> (en Asesor Virtual)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              2.2 Información Recopilada Automáticamente
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Cuando visitas nuestro sitio web, recopilamos automáticamente:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Dirección IP</strong></li>
              <li><strong>Tipo de navegador y dispositivo</strong></li>
              <li><strong>Páginas visitadas y tiempo en el sitio</strong></li>
              <li><strong>Referencia (cómo llegaste a nuestro sitio)</strong></li>
              <li><strong>Parámetros UTM</strong> (de campañas publicitarias en TikTok, Facebook, Google)</li>
            </ul>
          </section>

          {/* Cómo Usamos tu Información */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Cómo Usamos tu Información
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Procesar reservas de citas</strong> y contactarte para confirmar tu evaluación</li>
              <li><strong>Responder a tus consultas</strong> sobre tratamientos y servicios</li>
              <li><strong>Proporcionar recomendaciones personalizadas</strong> a través de nuestro Asesor Virtual con IA (Google Gemini AI)</li>
              <li><strong>Mejorar nuestro sitio web</strong> y experiencia de usuario</li>
              <li><strong>Enviar comunicaciones relevantes</strong> (solo con tu consentimiento)</li>
              <li><strong>Analizar el rendimiento de nuestras campañas publicitarias</strong> (TikTok Ads, Facebook Ads)</li>
              <li><strong>Cumplir con obligaciones legales</strong></li>
            </ul>
          </section>

          {/* Servicios de Terceros */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Servicios de Terceros que Utilizamos
            </h2>

            <div className="space-y-5">
              <div className="border-l-4 border-[#ea899a] pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  4.1 Google Gemini AI (Inteligencia Artificial)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Nuestro Asesor Virtual utiliza <strong>Google Gemini AI</strong> para analizar
                  tus consultas sobre problemas de piel y proporcionar recomendaciones personalizadas.
                  Las consultas se envían a los servidores de Google para su procesamiento.
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  • Proveedor: Google LLC<br />
                  • Política de privacidad: <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ea899a] hover:underline"
                  >
                    https://policies.google.com/privacy
                  </a>
                </p>
              </div>

              <div className="border-l-4 border-[#ea899a] pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  4.2 TikTok Pixel (Análisis y Publicidad)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Utilizamos el <strong>TikTok Pixel</strong> en algunas landing pages para medir
                  la efectividad de nuestras campañas publicitarias en TikTok y ofrecerte anuncios
                  más relevantes.
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  • Proveedor: TikTok Inc.<br />
                  • ID del Pixel: D19VBFJC77UDOT6CAUF0<br />
                  • Política de privacidad: <a
                    href="https://www.tiktok.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ea899a] hover:underline"
                  >
                    https://www.tiktok.com/legal/privacy-policy
                  </a>
                </p>
              </div>

              <div className="border-l-4 border-[#ea899a] pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  4.3 n8n (Automatización de Formularios)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Utilizamos <strong>n8n</strong> para procesar los formularios de contacto y
                  reservas, automatizando notificaciones y almacenamiento de datos.
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  • Servidor: dermica-pro-n8n.rcsgeg.easypanel.host<br />
                  • Los datos se envían de forma segura mediante HTTPS
                </p>
              </div>

              <div className="border-l-4 border-[#ea899a] pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  4.4 WhatsApp Business API
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Facilitamos el contacto directo a través de <strong>WhatsApp Business</strong>
                  para agendar citas y resolver consultas. Al hacer clic en nuestros enlaces de
                  WhatsApp, serás redirigido a la aplicación WhatsApp.
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  • Número: +51 974 637 783<br />
                  • Política de privacidad: <a
                    href="https://www.whatsapp.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ea899a] hover:underline"
                  >
                    https://www.whatsapp.com/legal/privacy-policy
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Cookies y Tecnologías de Rastreo */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Cookies y Tecnologías de Rastreo
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Utilizamos cookies y tecnologías similares para:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Recordar tus preferencias y mejorar tu experiencia</li>
              <li>Analizar el tráfico del sitio web</li>
              <li>Medir el rendimiento de campañas publicitarias (TikTok Pixel)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Puedes controlar las cookies desde la configuración de tu navegador. Sin embargo,
              desactivar las cookies puede afectar algunas funcionalidades del sitio.
            </p>
          </section>

          {/* Compartir Información */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Compartir tu Información
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>No vendemos ni alquilamos</strong> tu información personal a terceros.
              Solo compartimos datos en las siguientes circunstancias:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Con proveedores de servicios:</strong> Google Gemini AI, TikTok, n8n, WhatsApp (según descrito en la sección 4)</li>
              <li><strong>Cumplimiento legal:</strong> Si es requerido por ley o autoridades</li>
              <li><strong>Con tu consentimiento:</strong> En cualquier otra situación, solo con tu autorización explícita</li>
            </ul>
          </section>

          {/* Seguridad de Datos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Seguridad de tus Datos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu
              información personal contra acceso no autorizado, pérdida o alteración. Esto incluye:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
              <li>Cifrado HTTPS en toda la comunicación del sitio web</li>
              <li>Validación de formularios para prevenir inyección de código malicioso</li>
              <li>Acceso restringido a datos personales solo a personal autorizado</li>
              <li>Revisiones periódicas de seguridad</li>
            </ul>
          </section>

          {/* Retención de Datos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Retención de Datos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Conservamos tu información personal solo durante el tiempo necesario para cumplir
              con los fines descritos en esta política, o según lo requiera la ley.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Los datos de contacto se mantienen mientras mantengas comunicación con nosotros o
              uses nuestros servicios. Puedes solicitar la eliminación de tus datos en cualquier momento.
            </p>
          </section>

          {/* Tus Derechos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Tus Derechos de Privacidad
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Según las leyes de protección de datos (GDPR, LGPD), tienes los siguientes derechos:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Acceso:</strong> Solicitar una copia de los datos que tenemos sobre ti</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
              <li><strong>Eliminación:</strong> Solicitar la eliminación de tus datos personales</li>
              <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
              <li><strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado</li>
              <li><strong>Retirar consentimiento:</strong> Retirar tu consentimiento en cualquier momento</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Para ejercer cualquiera de estos derechos, contáctanos en:
            </p>
            <div className="bg-gray-100 p-4 rounded-md mt-3">
              <p className="text-gray-800">
                📧 Email: <a href="mailto:contacto@dermicapro.com" className="text-[#ea899a] hover:underline">
                  contacto@dermicapro.com
                </a>
              </p>
              <p className="text-gray-800 mt-1">
                📱 WhatsApp: <a href="https://wa.me/51974637783" className="text-[#ea899a] hover:underline">
                  +51 974 637 783
                </a>
              </p>
            </div>
          </section>

          {/* Privacidad de Menores */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Privacidad de Menores de Edad
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos
              intencionalmente información personal de menores. Si eres padre/madre y descubres
              que tu hijo nos ha proporcionado información personal, contáctanos para eliminarla.
            </p>
          </section>

          {/* Enlaces a Otros Sitios */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Enlaces a Otros Sitios Web
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nuestro sitio puede contener enlaces a sitios web de terceros (Facebook, Instagram,
              WhatsApp, etc.). No somos responsables de las prácticas de privacidad de esos sitios.
              Te recomendamos leer sus políticas de privacidad.
            </p>
          </section>

          {/* Cambios a esta Política */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Cambios a esta Política de Privacidad
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios
              en nuestras prácticas o por razones legales. La fecha de "Última actualización"
              al inicio de esta página indica cuándo se realizó la última revisión.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Te notificaremos sobre cambios significativos mediante un aviso en nuestro sitio web
              o por correo electrónico (si nos has proporcionado tu email).
            </p>
          </section>

          {/* Contacto */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Contacto
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Si tienes preguntas, inquietudes o solicitudes sobre esta Política de Privacidad
              o el manejo de tus datos personales, contáctanos:
            </p>
            <div className="bg-[#ea899a] bg-opacity-10 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">DermicaPro</h3>
              <p className="text-gray-700">
                📍 <strong>Dirección:</strong> Av. Larco 877, Trujillo, Perú
              </p>
              <p className="text-gray-700 mt-2">
                📧 <strong>Email:</strong> <a
                  href="mailto:contacto@dermicapro.com"
                  className="text-[#ea899a] hover:underline font-semibold"
                >
                  contacto@dermicapro.com
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                📱 <strong>WhatsApp:</strong> <a
                  href="https://wa.me/51974637783"
                  className="text-[#ea899a] hover:underline font-semibold"
                >
                  +51 974 637 783
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                🌐 <strong>Sitio web:</strong> <a
                  href="https://dermicapro.com"
                  className="text-[#ea899a] hover:underline font-semibold"
                >
                  dermicapro.com
                </a>
              </p>
            </div>
          </section>

          {/* Footer de aceptación */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Al utilizar nuestros servicios, confirmas que has leído y comprendido esta
              Política de Privacidad y aceptas el procesamiento de tus datos personales
              según lo descrito aquí.
            </p>
          </div>
        </div>

        {/* CTA de regreso */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center text-[#ea899a] font-semibold hover:text-[#d37989] transition-colors"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidadPage;
