// OAuth 2.0 Authorization Code + PKCE (public SPA client).
const CONFIG = {
  domain: 'https://us-east-18tkl4u1lm.auth.us-east-1.amazoncognito.com',
  clientId: '40hkvlmk5fss41v205uh1ctuqg',
  redirectUri: 'https://ufersa-resolve.luizeduardo.zangado.web.ufersa.dev.br/',
  scopes: 'openid email profile',
};
const KEY = 'ufersa-cognito-session';
const STATE_KEY = 'ufersa-cognito-oauth-state';
const VERIFIER_KEY = 'ufersa-cognito-pkce-verifier';
const bytesToBase64Url = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const randomString = () => bytesToBase64Url(crypto.getRandomValues(new Uint8Array(32)));
const sha256 = async text => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
const parseJwt = token => {
  try { return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); }
  catch { return null; }
};
const save = session => sessionStorage.setItem(KEY, JSON.stringify(session));
export const getSession = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch { return null; }
};
export const getUser = () => {
  const session = getSession();
  return session?.id_token ? parseJwt(session.id_token) : null;
};
export async function beginLogin() {
  const verifier = randomString();
  const state = randomString();
  sessionStorage.setItem(VERIFIER_KEY, verifier);
  sessionStorage.setItem(STATE_KEY, state);
  const params = new URLSearchParams({ client_id: CONFIG.clientId, response_type: 'code', scope: CONFIG.scopes,
    redirect_uri: CONFIG.redirectUri, code_challenge_method: 'S256', code_challenge: bytesToBase64Url(await sha256(verifier)), state });
  window.location.assign(`${CONFIG.domain}/oauth2/authorize?${params}`);
}
async function tokenRequest(params) {
  const response = await fetch(`${CONFIG.domain}/oauth2/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(params),
  });
  if (!response.ok) throw new Error('Não foi possível concluir a autenticação no Cognito.');
  return response.json();
}
export async function handleCallback() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  if (!code && !error) return;
  const state = url.searchParams.get('state');
  const expected = sessionStorage.getItem(STATE_KEY);
  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  // Remove the one-time code from browser history, keeping hash routing intact.
  ['code', 'state', 'error', 'error_description'].forEach(key => url.searchParams.delete(key));
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  if (error) throw new Error('O login foi cancelado ou recusado pelo Cognito.');
  if (!expected || state !== expected || !verifier) throw new Error('Estado de login inválido. Inicie a autenticação novamente.');
  sessionStorage.removeItem(STATE_KEY);
  sessionStorage.removeItem(VERIFIER_KEY);
  const result = await tokenRequest({ grant_type: 'authorization_code', client_id: CONFIG.clientId,
    code, redirect_uri: CONFIG.redirectUri, code_verifier: verifier });
  save({ ...result, expires_at: Date.now() + result.expires_in * 1000 });
}
export async function getAccessToken() {
  const session = getSession();
  if (!session?.access_token) return null;
  if (Date.now() < session.expires_at - 60_000) return session.access_token;
  if (!session.refresh_token) return null;
  try {
    const updated = await tokenRequest({ grant_type: 'refresh_token', client_id: CONFIG.clientId, refresh_token: session.refresh_token });
    save({ ...session, ...updated, refresh_token: updated.refresh_token || session.refresh_token, expires_at: Date.now() + updated.expires_in * 1000 });
    return updated.access_token;
  } catch { sessionStorage.removeItem(KEY); return null; }
}
export function logout() {
  sessionStorage.removeItem(KEY);
  sessionStorage.removeItem(STATE_KEY);
  sessionStorage.removeItem(VERIFIER_KEY);
  const params = new URLSearchParams({ client_id: CONFIG.clientId, logout_uri: CONFIG.redirectUri });
  window.location.assign(`${CONFIG.domain}/logout?${params}`);
}
