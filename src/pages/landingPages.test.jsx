import { render, fireEvent, waitFor, act } from '@testing-library/react';
import HifuLandingPage from './HifuLandingPage';
import HollywoodPeelPage from './HollywoodPeelPage';
import BotoxLandingPage from './BotoxLandingPage';
import { handleFormSubmission } from '../services/webhookService';

jest.mock('../services/webhookService', () => ({
  handleFormSubmission: jest.fn(),
  TRATAMIENTOS: {
    HIFU: 'HIFU 12D',
    BOTOX: 'Botox',
    HOLLYWOOD_PEEL: 'Hollywood Peel',
  },
  LANDINGS: {
    HIFU: 'hifu-landing',
    BOTOX: 'botox-landing',
    HOLLYWOOD_PEEL: 'hollywood-peel-landing',
  },
}));

jest.mock('../utils/trackingHelper', () => ({
  captureAllUTM: jest.fn(() => ({})),
  trackPageViewConditional: jest.fn(),
}));

// Registro de landing pages: agregar aquí al crear una nueva
const LANDING_PAGES = [
  { nombre: 'HifuLandingPage',   Component: HifuLandingPage,   tratamiento: 'HIFU 12D',       landing: 'hifu-landing'           },
  { nombre: 'HollywoodPeelPage', Component: HollywoodPeelPage, tratamiento: 'Hollywood Peel', landing: 'hollywood-peel-landing' },
  { nombre: 'BotoxLandingPage',  Component: BotoxLandingPage,  tratamiento: 'Botox',          landing: 'botox-landing'          },
];

const formValidos = {
  nombre: 'Ana García',
  whatsapp: '987654321',
  email: 'ana@example.com',
};

async function llenarYEnviarFormulario(container) {
  await act(async () => {
    fireEvent.change(container.querySelector('[name="nombre"]'), {
      target: { name: 'nombre', value: formValidos.nombre },
    });
    fireEvent.change(container.querySelector('[name="whatsapp"]'), {
      target: { name: 'whatsapp', value: formValidos.whatsapp },
    });
    fireEvent.change(container.querySelector('[name="email"]'), {
      target: { name: 'email', value: formValidos.email },
    });
    fireEvent.submit(container.querySelector('form'));
  });
}

beforeEach(() => {
  handleFormSubmission.mockResolvedValue(undefined);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe.each(LANDING_PAGES)('$nombre', ({ Component, tratamiento, landing }) => {
  test('dado que el usuario llena el formulario, cuando lo envía, entonces llama a handleFormSubmission con el tratamiento y landing correctos', async () => {
    // Given
    const { container } = render(<Component />);

    // When
    await llenarYEnviarFormulario(container);

    // Then
    await waitFor(() => {
      expect(handleFormSubmission).toHaveBeenCalledWith(
        expect.objectContaining({ tratamiento, landing })
      );
    });
  });

  test('dado que el usuario llena el formulario, cuando lo envía, entonces el formData incluye nombre, whatsapp y email correctos', async () => {
    // Given
    const { container } = render(<Component />);

    // When
    await llenarYEnviarFormulario(container);

    // Then
    await waitFor(() => {
      expect(handleFormSubmission).toHaveBeenCalledWith(
        expect.objectContaining({
          formData: expect.objectContaining({
            nombre: formValidos.nombre,
            whatsapp: formValidos.whatsapp,
            email: formValidos.email,
          }),
        })
      );
    });
  });

  test('dado que el formulario está vacío, cuando el usuario lo envía, entonces NO llama a handleFormSubmission', async () => {
    // Given
    const { container } = render(<Component />);

    // When
    await act(async () => {
      fireEvent.submit(container.querySelector('form'));
    });

    // Then
    expect(handleFormSubmission).not.toHaveBeenCalled();
  });
});
