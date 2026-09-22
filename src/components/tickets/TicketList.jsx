import { ChevronRight, Wind, Lightbulb, Droplets } from 'lucide-react';
const icons={climate:Wind,electric:Lightbulb,water:Droplets};
const statusClass = status => status === 'Resolvido' ? 's2' : status === 'Em atendimento' ? 's0' : 's1';
export default function TicketList({ tickets=[], onOpen }){
  if (!tickets.length) return <div className="empty">Nenhum chamado encontrado.</div>;
  return <div className="tickets">{tickets.map((ticket,i)=>{const Icon=icons[ticket.icon] || Lightbulb; return <button type="button" className="ticket ticket-button" key={`${ticket.protocol}-${i}`} onClick={()=>onOpen?.(ticket.protocol)}><div className={`ico i${i%3}`}><Icon/></div><div className="grow"><b>{ticket.title}</b><span>{ticket.protocol} · {ticket.category} · {ticket.location}</span></div><span className={`status ${statusClass(ticket.status)}`}>{ticket.status}</span><ChevronRight/></button>})}</div>
}
