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

// Chat Interfaces
export interface ChatSession {
  session_id: string;
  message: string;
  language: string;
}

export interface ChatMessage {
  response: string;
  session_id: string;
  on_topic: boolean;
  error?: string;
}

export interface ChatHistoryResponse {
  session_id: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface CreateSessionRequest {
  material_type?: string;
  is_recyclable?: boolean;
  material_info?: string;
  language: string;
}

export interface SendMessageRequest {
  session_id: string;
  message: string;
}

export interface UpdateMaterialRequest {
  session_id: string;
  material_type: string;
  is_recyclable: boolean;
  material_info: string;
}

// Prediction API
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

// Chat API
export const createChatSession = async (request: CreateSessionRequest): Promise<ChatSession> => {
  const response = await fetch(`${API_URL}/chat/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Error al crear sesión de chat');
  }

  return response.json();
};

export const sendChatMessage = async (request: SendMessageRequest): Promise<ChatMessage> => {
  const response = await fetch(`${API_URL}/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Error al enviar mensaje');
  }

  return response.json();
};

export const getChatHistory = async (sessionId: string): Promise<ChatHistoryResponse> => {
  const response = await fetch(`${API_URL}/chat/history/${sessionId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Error al obtener historial');
  }

  return response.json();
};

export const deleteChatSession = async (sessionId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/chat/session/${sessionId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Error al eliminar sesión');
  }
};

export const updateMaterialContext = async (request: UpdateMaterialRequest): Promise<ChatSession> => {
  const response = await fetch(`${API_URL}/chat/material`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Error al actualizar contexto');
  }

  return response.json();
};
