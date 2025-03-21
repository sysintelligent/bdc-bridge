import React from 'react';
import { Button } from './ui/button';
import { Menu, User } from 'lucide-react';
import { useAppSelector } from '../hooks/redux';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ThemeToggle } from './theme-toggle';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex-1 text-lg font-semibold">
          DMI CLI Dashboard
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">
                {user?.name || 'User'}
              </span>
            </div>
          ) : (
            <Button>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 