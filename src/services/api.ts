const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface PredictionResponse {
  clase: string;
  confianza: number;
  es_reciclable: boolean;
  mensaje: string;
}

export interface ErrorResponse {
  error: boolean;
  mensaje: string;
  codigo: number;
}

export const predictImage = async (file: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.mensaje || 'Error al clasificar la imagen');
  }

  return response.json();
};

export const checkHealth = async (): Promise<{ status: string; message: string }> => {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
};
