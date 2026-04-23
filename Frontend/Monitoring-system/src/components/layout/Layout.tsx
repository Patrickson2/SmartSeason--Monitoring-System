import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

// Page titles based on route
const getPageTitle = (pathname: string, role: string | undefined): string => {
  if (pathname.includes('/dashboard')) return 'Dashboard';
  if (pathname.includes('/fields')) return role === 'admin' ? 'Fields' : 'My Fields';
  if (pathname.includes('/agents')) return 'Agents';
  return '';
};

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  
  // Get the page title from current route
  const title = getPageTitle(location.pathname, user?.role);

  return (
    <div style={layoutStyle}>
      <Sidebar />
      <div style={mainStyle}>
        <Navbar title={title} />
        <main style={contentStyle}>
          {children}
        </main>
      </div>
    </div>
  );
}

const layoutStyle = {
  display: 'flex',
  minHeight: '100vh',
} as const;

const mainStyle = {
  flex: 1,
  marginLeft: '220px',
  display: 'flex',
  flexDirection: 'column',
} as const;

const contentStyle = {
  flex: 1,
  backgroundColor: 'var(--color-bg)',
} as const;