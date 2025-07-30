
import React from 'react';
import Sidebar from './Sidebar';
import { useIsMobile } from '../hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      {!isMobile && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {isMobile && (
          <header className="bg-card border-b border-border p-4 flex items-center justify-between lg:hidden">
            <div className="flex items-center space-x-3">
              <Sidebar />
              <img 
                src="/lovable-uploads/514150da-8678-460a-bcbc-ee548d8d6098.png" 
                alt="Second Vintage" 
                className="h-8 object-contain"
              />
            </div>
          </header>
        )}
        <main className="flex-1 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
