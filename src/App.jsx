import { useEffect, useMemo, useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import NewRequestPage from './pages/NewRequestPage';
import MyRequestsPage from './pages/MyRequestsPage';
import ManagerDashboardPage from './pages/ManagerDashboardPage';
import TicketDetailsPage from './pages/TicketDetailsPage';
import { tickets as initialTickets } from './data/tickets';

const pages = { inicio: HomePage, novo: NewRequestPage, meus: MyRequestsPage, painel: ManagerDashboardPage, detalhes: TicketDetailsPage };
const STORAGE_KEY = 'ufersa-resolve-tickets';

function routeFromHash() {
  const value = window.location.hash.replace('#/', '');
  const [page, protocol] = value.split('/');
  return { page: pages[page] ? page : 'inicio', protocol: protocol ? decodeURIComponent(protocol) : null };
}

export default function App() {
  const initialRoute = routeFromHash();
  const [page, setPage] = useState(initialRoute.page);
  const [selectedProtocol, setSelectedProtocol] = useState(initialRoute.protocol);
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) && saved.length ? saved : initialTickets;
    } catch { return initialTickets; }
  });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => {
    const onHashChange = () => {
      const route = routeFromHash();
      setPage(route.page); setSelectedProtocol(route.protocol);
    };
    window.addEventListener('hashchange', onHashChange);
    if (!window.location.hash) window.history.replaceState(null, '', '#/inicio');
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (target, protocol = null) => {
    const hash = protocol ? `#/${target}/${encodeURIComponent(protocol)}` : `#/${target}`;
    if (window.location.hash === hash) { setPage(target); setSelectedProtocol(protocol); }
    else window.location.hash = hash;
  };

  const createTicket = (form) => {
    const year = new Date().getFullYear();
    const existing = tickets.map(t => Number(String(t.protocol).split('-').pop().replace(/\D/g, '')) || 0);
    const next = Math.max(148, ...existing) + 1;
    const protocol = `#${year}-${String(next).padStart(4, '0')}`;
    const icon = form.category === 'Climatização' ? 'climate' : form.category === 'Hidráulica' ? 'water' : 'electric';
    const ticket = {
      protocol, title: form.title.trim(), category: form.category,
      location: `${form.building.trim()} • ${form.room.trim()}`,
      campus: form.campus, description: form.description.trim(), priority: form.priority,
      status: 'Aberto', icon, createdAt: new Date().toLocaleString('pt-BR'),
      fileName: form.file?.name || null,
      history: [{ status: 'Aberto', date: new Date().toLocaleString('pt-BR'), note: 'Solicitação registrada pelo usuário.' }]
    };
    setTickets(current => [ticket, ...current]);
    return protocol;
  };

  const selectedTicket = useMemo(() => tickets.find(t => t.protocol === selectedProtocol), [tickets, selectedProtocol]);
  const Page = pages[page] || HomePage;
  return <AppLayout page={page} onNavigate={navigate}>
    <Page onNavigate={navigate} tickets={tickets} ticket={selectedTicket} onCreateTicket={createTicket} />
  </AppLayout>;
}
