import React from 'react';
import { ThemeProvider } from './components/theme-provider';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { usePathname } from 'next/navigation';

function App() {
  const pathname = usePathname();

  const renderContent = () => {
    switch (pathname) {
      case '/':
        return <Dashboard />;
      case '/applications':
        return <Applications />;
      case '/settings':
        return <Settings />;
      default:
        return <NotFound />;
    }
  };

  return (
    <ThemeProvider defaultTheme="light" enableSystem={true}>
      <div className="relative min-h-screen">
        <Header />
        <Sidebar />
        <main className="flex-1 p-6 pt-16 md:ml-64">
          {renderContent()}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App; 