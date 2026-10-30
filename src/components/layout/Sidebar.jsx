import { Home, PlusCircle, ClipboardList, LayoutDashboard, MessageCircle, LogOut } from 'lucide-react';
import Logo from '../common/Logo';
import { getUser, logout } from '../../services/cognitoAuth';
const items=[['inicio','Início',Home],['novo','Abrir solicitação',PlusCircle],['meus','Meus chamados',ClipboardList],['painel','Painel gerencial',LayoutDashboard],['assistente','Assistente IA',MessageCircle]];
export default function Sidebar({ page, onNavigate }){
  const user = getUser();
  const name = user?.name || user?.email?.split('@')[0] || 'Usuário';
  const initials = name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase()).join('');
  const activePage = page === 'detalhes' ? 'meus' : page;
  return <aside><Logo/><nav>{items.map(([id,label,Icon])=><button type="button" key={id} className={activePage===id?'active':''} onClick={()=>onNavigate(id)}><Icon/>{label}</button>)}</nav><div className="profile"><div className="avatar">{initials}</div><div><b>{name}</b><span>Discente</span></div><button type="button" onClick={logout} title="Sair da conta" aria-label="Sair da conta" className="logout-button"><LogOut/></button></div></aside>
}
