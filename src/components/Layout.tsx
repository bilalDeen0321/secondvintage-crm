
import { usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useIsMobile } from '../hooks/use-mobile';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  const { props } = usePage();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flash = props.flash as any;
  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.success(flash.error)
    }
  }, [flash.success, flash.error]);

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
