import { MapPin } from 'lucide-react';
const titles={inicio:'Olá, Luiz!',novo:'Abrir nova solicitação',meus:'Meus chamados',painel:'Painel gerencial',detalhes:'Detalhes do chamado'};
export default function Header({ page }){return <header><div><small>UFERSA Resolve</small><h1>{titles[page] || 'UFERSA Resolve'}</h1></div><div className="campus"><MapPin/>Campus Pau dos Ferros</div></header>}
