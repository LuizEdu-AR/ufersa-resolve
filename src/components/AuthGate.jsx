import { useEffect, useState } from 'react';
import { beginLogin, getAccessToken, getUser, handleCallback } from '../services/cognitoAuth';

export default function AuthGate({ children }) {
  const [status, setStatus] = useState({ loading: true, error: '' });
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await handleCallback();
        const token = await getAccessToken();
        if (!active) return;
        if (!token || !getUser()) { await beginLogin(); return; }
        setStatus({ loading: false, error: '' });
      } catch (error) { if (active) setStatus({ loading: false, error: error.message }); }
    })();
    return () => { active = false; };
  }, []);
  if (status.error) return <div className="auth-screen"><div className="auth-card"><h1>Não foi possível entrar</h1><p>{status.error}</p><button onClick={() => beginLogin()}>Tentar novamente</button></div></div>;
  if (status.loading) return <div className="auth-screen" role="status">Validando acesso com Amazon Cognito...</div>;
  return children;
}
