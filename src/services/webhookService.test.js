import {
  sendToWebhook,
  createWebhookPayload,
  handleFormSubmission,
  TRATAMIENTOS,
  LANDINGS,
} from "./webhookService";

const EXPECTED_WEBHOOK_URL = "https://n8n.dermicapro.online/webhook/landing";

const formDataSinPrefijo = {
  nombre: "Ana García",
  whatsapp: "987654321",
  email: "ana@example.com",
};

const formDataConPrefijo = {
  ...formDataSinPrefijo,
  whatsapp: "+51987654321",
};

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

// ─── URL del endpoint ────────────────────────────────────────────────────────

describe("sendToWebhook", () => {
  test("dado cualquier landing de servicio, cuando se envía el formulario, entonces se llama al endpoint correcto de n8n", async () => {
    // Given
    global.fetch.mockResolvedValueOnce({ ok: true });

    // When
    await sendToWebhook(formDataSinPrefijo, TRATAMIENTOS.HIFU, LANDINGS.HIFU);

    // Then
    expect(global.fetch).toHaveBeenCalledWith(
      EXPECTED_WEBHOOK_URL,
      expect.any(Object),
    );
  });

  test.each([
    ["HIFU", TRATAMIENTOS.HIFU, LANDINGS.HIFU],
    ["Botox", TRATAMIENTOS.BOTOX, LANDINGS.BOTOX],
    ["Hollywood Peel", TRATAMIENTOS.HOLLYWOOD_PEEL, LANDINGS.HOLLYWOOD_PEEL],
  ])(
    "dado la landing %s, cuando se envía el formulario, entonces apunta a https://n8n.dermicapro.online/webhook/landing",
    async (_name, tratamiento, landing) => {
      // Given
      global.fetch.mockResolvedValueOnce({ ok: true });

      // When
      await sendToWebhook(formDataSinPrefijo, tratamiento, landing);

      // Then
      expect(global.fetch).toHaveBeenCalledWith(
        EXPECTED_WEBHOOK_URL,
        expect.any(Object),
      );
    },
  );

  test("dado que el servidor responde ok, cuando se envía el webhook, entonces retorna success: true", async () => {
    // Given
    global.fetch.mockResolvedValueOnce({ ok: true });

    // When
    const result = await sendToWebhook(
      formDataSinPrefijo,
      TRATAMIENTOS.BOTOX,
      LANDINGS.BOTOX,
    );

    // Then
    expect(result.success).toBe(true);
  });

  test("dado que el servidor responde con error 500, cuando se envía el webhook, entonces retorna success: false con código de error", async () => {
    // Given
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    // When
    const result = await sendToWebhook(
      formDataSinPrefijo,
      TRATAMIENTOS.HIFU,
      LANDINGS.HIFU,
    );

    // Then
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/500/);
  });

  test("dado que hay un error de red, cuando se envía el webhook, entonces retorna success: false con mensaje de conexión", async () => {
    // Given
    global.fetch.mockRejectedValueOnce(new Error("Network Error"));

    // When
    const result = await sendToWebhook(
      formDataSinPrefijo,
      TRATAMIENTOS.HIFU,
      LANDINGS.HIFU,
    );

    // Then
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/conexión/i);
  });

  test("dado que la petición supera el tiempo límite, cuando se envía el webhook, entonces retorna success: false con mensaje de timeout", async () => {
    // Given
    const abortError = new Error("Aborted");
    abortError.name = "AbortError";
    global.fetch.mockRejectedValueOnce(abortError);

    // When
    const result = await sendToWebhook(
      formDataSinPrefijo,
      TRATAMIENTOS.HIFU,
      LANDINGS.HIFU,
    );

    // Then
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/tiempo/i);
  });
});

// ─── Payload ─────────────────────────────────────────────────────────────────

describe("createWebhookPayload", () => {
  test("dado un whatsapp sin prefijo, cuando se crea el payload, entonces agrega +51 al número", () => {
    // Given / When
    const payload = createWebhookPayload(
      formDataSinPrefijo,
      TRATAMIENTOS.HIFU,
      LANDINGS.HIFU,
    );

    // Then
    expect(payload.whatsapp).toBe("+51987654321");
  });

  test("dado un whatsapp que ya tiene +51, cuando se crea el payload, entonces no duplica el prefijo", () => {
    // Given / When
    const payload = createWebhookPayload(
      formDataConPrefijo,
      TRATAMIENTOS.HIFU,
      LANDINGS.HIFU,
    );

    // Then
    expect(payload.whatsapp).toBe("+51987654321");
  });

  test("dado un landing id, cuando se crea el payload, entonces incluye el campo landing", () => {
    // Given / When
    const payload = createWebhookPayload(
      formDataSinPrefijo,
      TRATAMIENTOS.HIFU,
      LANDINGS.HIFU,
    );

    // Then
    expect(payload.landing).toBe(LANDINGS.HIFU);
  });

  test("dado que no se pasa landing, cuando se crea el payload, entonces no incluye el campo landing", () => {
    // Given / When
    const payload = createWebhookPayload(formDataSinPrefijo, TRATAMIENTOS.HIFU);

    // Then
    expect(payload).not.toHaveProperty("landing");
  });

  test("dado UTM params con valores vacíos o nulos, cuando se crea el payload, entonces se filtran del resultado", () => {
    // Given
    const utmData = { ttclid: "abc123", tt_campaign_id: "", tt_ad_id: null };

    // When
    const payload = createWebhookPayload(
      formDataSinPrefijo,
      TRATAMIENTOS.HIFU,
      LANDINGS.HIFU,
      utmData,
    );

    // Then
    expect(payload.ttclid).toBe("abc123");
    expect(payload).not.toHaveProperty("tt_campaign_id");
    expect(payload).not.toHaveProperty("tt_ad_id");
  });

  test("dado datos del formulario completos, cuando se crea el payload, entonces incluye nombre, email y tratamiento", () => {
    // Given / When
    const payload = createWebhookPayload(
      formDataSinPrefijo,
      TRATAMIENTOS.HOLLYWOOD_PEEL,
      LANDINGS.HOLLYWOOD_PEEL,
    );

    // Then
    expect(payload.nombre).toBe(formDataSinPrefijo.nombre);
    expect(payload.email).toBe(formDataSinPrefijo.email);
    expect(payload.tratamiento).toBe(TRATAMIENTOS.HOLLYWOOD_PEEL);
  });
});

// ─── Ciclo completo ───────────────────────────────────────────────────────────

describe("handleFormSubmission", () => {
  test("dado que el webhook responde ok, cuando se envía el formulario, entonces llama onSuccess y no llama onError", async () => {
    // Given
    global.fetch.mockResolvedValueOnce({ ok: true });
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const setIsSubmitting = jest.fn();

    // When
    await handleFormSubmission({
      formData: formDataSinPrefijo,
      tratamiento: TRATAMIENTOS.HIFU,
      landing: LANDINGS.HIFU,
      onSuccess,
      onError,
      setIsSubmitting,
    });

    // Then
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test("dado que el webhook responde con error, cuando se envía el formulario, entonces llama onError y no llama onSuccess", async () => {
    // Given
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      text: async () => "Unprocessable Entity",
    });
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const setIsSubmitting = jest.fn();

    // When
    await handleFormSubmission({
      formData: formDataSinPrefijo,
      tratamiento: TRATAMIENTOS.BOTOX,
      landing: LANDINGS.BOTOX,
      onSuccess,
      onError,
      setIsSubmitting,
    });

    // Then
    expect(onError).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  test("dado cualquier resultado del webhook, cuando termina el envío, entonces setIsSubmitting se resetea a false", async () => {
    // Given
    global.fetch.mockRejectedValueOnce(new Error("Network Error"));
    const setIsSubmitting = jest.fn();

    // When
    await handleFormSubmission({
      formData: formDataSinPrefijo,
      tratamiento: TRATAMIENTOS.HOLLYWOOD_PEEL,
      landing: LANDINGS.HOLLYWOOD_PEEL,
      onSuccess: jest.fn(),
      onError: jest.fn(),
      setIsSubmitting,
    });

    // Then
    expect(setIsSubmitting).toHaveBeenLastCalledWith(false);
  });
});
