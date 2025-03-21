import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider defaultTheme="light" enableSystem={true}>
      <div className="relative min-h-screen">
        <Header />
        <Sidebar />
        <main className="flex-1 p-6 pt-16 md:ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App; 