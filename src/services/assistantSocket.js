import { getAccessToken } from './cognitoAuth';

const DEFAULT_WS_URL = 'wss://g1j6ueg53j.execute-api.us-east-1.amazonaws.com/prod/';
const WS_URL = import.meta.env.VITE_ASSISTANT_WS_URL || DEFAULT_WS_URL;

export async function connectAssistant({ onMessage, onStatus }) {
  const token = await getAccessToken();
  if (!token) throw new Error('Sessão expirada. Faça login novamente.');
  const url = new URL(WS_URL);
  url.searchParams.set('token', token);
  const socket = new WebSocket(url.toString());
  socket.addEventListener('open', () => onStatus('connected'));
  socket.addEventListener('message', event => {
    try { onMessage(JSON.parse(event.data)); }
    catch { onMessage({ type: 'error', message: 'Resposta inválida do servidor.' }); }
  });
  socket.addEventListener('error', () => onStatus('error'));
  socket.addEventListener('close', () => onStatus('disconnected'));
  return socket;
}
