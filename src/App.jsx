import { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import NewRequestPage from './pages/NewRequestPage';
import MyRequestsPage from './pages/MyRequestsPage';
import ManagerDashboardPage from './pages/ManagerDashboardPage';

const pages = { inicio: HomePage, novo: NewRequestPage, meus: MyRequestsPage, painel: ManagerDashboardPage };
export default function App() {
  const [page, setPage] = useState('inicio');
  const Page = pages[page];
  return <AppLayout page={page} onNavigate={setPage}><Page onNavigate={setPage} /></AppLayout>;
}
