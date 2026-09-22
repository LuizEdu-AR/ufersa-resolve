import { Home, PlusCircle, ClipboardList, LayoutDashboard, LogOut } from 'lucide-react';
import Logo from '../common/Logo';
const items=[['inicio','Início',Home],['novo','Abrir solicitação',PlusCircle],['meus','Meus chamados',ClipboardList],['painel','Painel gerencial',LayoutDashboard]];
export default function Sidebar({ page, onNavigate }){
  const activePage = page === 'detalhes' ? 'meus' : page;
  return <aside><Logo/><nav>{items.map(([id,label,Icon])=><button type="button" key={id} className={activePage===id?'active':''} onClick={()=>onNavigate(id)}><Icon/>{label}</button>)}</nav><div className="profile"><div className="avatar">LE</div><div><b>Luiz Eduardo</b><span>Discente</span></div><LogOut/></div></aside>
}
