import Sidebar from './Sidebar'; import Header from './Header';
export default function AppLayout({ page, onNavigate, children }){return <div className="app"><Sidebar page={page} onNavigate={onNavigate}/><main><Header page={page}/>{children}</main></div>}
