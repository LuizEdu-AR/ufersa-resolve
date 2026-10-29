import { MapPin } from 'lucide-react';
import { getUser } from '../../services/cognitoAuth';
const titles={inicio:'Olá, Luiz!',novo:'Abrir nova solicitação',meus:'Meus chamados',painel:'Painel gerencial',detalhes:'Detalhes do chamado'};
export default function Header({ page }){const name = (getUser()?.name || getUser()?.email?.split('@')[0] || 'Usuário').split(' ')[0]; return <header><div><small>UFERSA Resolve</small><h1>{page === 'inicio' ? `Olá, ${name}!` : (titles[page] || 'UFERSA Resolve')}</h1></div><div className="campus"><MapPin/>Campus Pau dos Ferros</div></header>}
