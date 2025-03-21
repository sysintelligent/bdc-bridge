import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <h1 className="text-7xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="mt-2 mb-6 text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Go to Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFound; 