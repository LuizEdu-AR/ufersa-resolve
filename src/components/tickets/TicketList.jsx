import { ChevronRight, Wind, Lightbulb, Droplets } from 'lucide-react';
import { tickets } from '../../data/tickets';
const icons={climate:Wind,electric:Lightbulb,water:Droplets};
export default function TicketList({ repeat=1 }){const rows=Array.from({length:repeat},()=>tickets).flat();return <div className="tickets">{rows.map((ticket,i)=>{const Icon=icons[ticket.icon]; const style=i%3; return <div className="ticket" key={`${ticket.protocol}-${i}`}><div className={`ico i${style}`}><Icon/></div><div className="grow"><b>{ticket.title}</b><span>{ticket.protocol} · {ticket.category} · {ticket.location}</span></div><span className={`status s${style}`}>{ticket.status}</span><ChevronRight/></div>})}</div>}
