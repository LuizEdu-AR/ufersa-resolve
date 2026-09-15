import { MapPin } from 'lucide-react';
const titles={inicio:'Olá, Luiz!',novo:'Abrir nova solicitação',meus:'Meus chamados',painel:'Painel gerencial'};
export default function Header({ page }){return <header><div><small>UFERSA Resolve</small><h1>{titles[page]}</h1></div><div className="campus"><MapPin/>Campus Pau dos Ferros</div></header>}
