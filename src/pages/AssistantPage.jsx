import { useEffect, useRef, useState } from 'react';
import { Send, RefreshCw, Bot } from 'lucide-react';
import { connectAssistant } from '../services/assistantSocket';

export default function AssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('connecting');
  const [pending, setPending] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const pendingRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, pending]);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;
    let socket = null;
    setStatus('connecting');
    connectAssistant({
      onStatus: next => {
        if (!cancelled) {
          setStatus(next);
          if (next !== 'connected' && pendingRef.current) {
            pendingRef.current = false;
            setPending(false);
            setMessages(prev => [...prev, { role: 'error', text: 'Conexão interrompida. Tente novamente.' }]);
          }
        }
      },
      onMessage: data => {
        if (cancelled) return;
        if (data.type === 'response' || data.type === 'error') {
          pendingRef.current = false;
          setPending(false);
          setMessages(prev => [...prev, {
            role: data.type === 'response' ? 'assistant' : 'error',
            text: String(data.message || 'Resposta vazia.')
          }]);
        }
      }
    }).then(ws => {
      if (cancelled) ws.close();
      else { socket = ws; socketRef.current = ws; }
    }).catch(error => {
      if (!cancelled) { setStatus('error'); setMessages(prev => [...prev, { role: 'error', text: error.message }]); }
    });
    return () => {
      cancelled = true;
      mountedRef.current = false;
      socketRef.current = null;
      socket?.close();
    };
  }, []);

  function send(event) {
    event.preventDefault();
    const question = input.trim();
    if (!question || question.length > 4000 || pendingRef.current || socketRef.current?.readyState !== WebSocket.OPEN) return;
    try {
      socketRef.current.send(JSON.stringify({ action: 'sendMessage', message: question }));
      pendingRef.current = true;
      setPending(true);
      setMessages(prev => [...prev, { role: 'user', text: question }]);
      setInput('');
    } catch {
      setMessages(prev => [...prev, { role: 'error', text: 'Falha ao enviar a mensagem.' }]);
    }
  }

  return <section className="assistant-panel">
    <div className="assistant-header"><div><h2><Bot size={22}/> Assistente IA</h2><p>Faça perguntas e receba respostas com inteligência artificial.</p></div><span className={'assistant-status '+status}>{status === 'connected' ? 'Conectado' : status === 'connecting' ? 'Conectando...' : 'Desconectado'}</span></div>
    <div className="assistant-messages" aria-live="polite">
      {messages.length === 0 && <div className="assistant-empty">Como posso ajudar você hoje?</div>}
      {messages.map((item, index) => <div key={index} className={'assistant-bubble '+item.role}>{item.text}</div>)}
      {pending && <div className="assistant-bubble assistant">Aguarde, estou preparando a resposta...</div>}
      <div ref={bottomRef}/>
    </div>
    <form className="assistant-form" onSubmit={send}>
      <textarea aria-label="Sua pergunta" placeholder="Digite sua pergunta..." maxLength={4000} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(e);}}} rows={2}/>
      <button className="primary" type="submit" disabled={status!=='connected'||pending||!input.trim()}><Send size={16}/> Enviar</button>
    </form>
    <p className="assistant-note">As respostas da IA podem conter imprecisões. Confira informações importantes.</p>
  </section>;
}
