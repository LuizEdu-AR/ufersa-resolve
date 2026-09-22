import { useMemo, useState } from 'react';
import { Search } from 'lucide-react'; import TicketList from '../components/tickets/TicketList';
export default function MyRequestsPage({ tickets=[], onNavigate }) {
 const [query,setQuery]=useState(''); const [filter,setFilter]=useState('Todos');
 const counts={Todos:tickets.length,Abertos:tickets.filter(t=>['Aberto','Recebido'].includes(t.status)).length,'Em atendimento':tickets.filter(t=>t.status==='Em atendimento').length,Resolvidos:tickets.filter(t=>t.status==='Resolvido').length};
 const visible=useMemo(()=>tickets.filter(t=>{
   const q=query.toLowerCase().trim(); const matches=!q || `${t.protocol} ${t.title} ${t.category} ${t.location}`.toLowerCase().includes(q);
   const status=filter==='Todos' || (filter==='Abertos' ? ['Aberto','Recebido'].includes(t.status) : t.status===filter); return matches&&status;
 }),[tickets,query,filter]);
 return <section className="panel big"><div className="toolbar"><div><h3>Minhas solicitações</h3><p>Consulte protocolos e acompanhe o andamento.</p></div><div className="search"><Search /><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por protocolo ou título" /></div></div><div className="filters">{Object.entries(counts).map(([name,count])=><button type="button" key={name} className={filter===name?'selected':''} onClick={()=>setFilter(name)}>{name} {count}</button>)}</div><TicketList tickets={visible} onOpen={p=>onNavigate('detalhes',p)} /></section>
}
