
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChartArea,
  Users,
  Settings,
  File,
  Clock,
  LogOut,
  Menu,
  X,
  ChartNoAxesColumnIncreasing,
  PackageOpen,
  BadgeEuro,
  Gauge,
  LayoutList,
  Network,
  Database,
  List,
  Calendar,
  Watch,
  Store,
  Hammer
} from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';

const menuItems = [
  { name: 'Dashboard', icon: ChartArea, path: '/' },
  { name: 'Watch Management', icon: Clock, path: '/watches' },
  { name: 'Multi-platform Sales', icon: ChartNoAxesColumnIncreasing, path: '/sales' },
  { name: 'Batch Management', icon: PackageOpen, path: '/batch' },
  { name: 'Promote / Social Media', icon: Calendar, path: '/promote', opacity: 'opacity-50' },
  { name: 'Sales History / Stats', icon: BadgeEuro, path: '/history' },
  { name: 'Performance Tracking', icon: Gauge, path: '/performance', opacity: 'opacity-50' },
  { name: 'Wish List', icon: LayoutList, path: '/wishlist' },
  { name: 'Agent Balance', icon: Network, path: '/payments' },
  { name: 'Agent Watches', icon: Watch, path: '/agent-watches' },
  { name: 'Seller Watches', icon: Store, path: '/sellers' },
  { name: 'Invoices', icon: File, path: '/invoices', opacity: 'opacity-50' },
  { name: 'Users', icon: Users, path: '/users' },
  { name: 'Tools', icon: Hammer, path: '/tools', opacity: 'opacity-50' },
  { name: 'Full Data View', icon: Database, path: '/data' },
  { name: 'Settings', icon: Settings, path: '/settings' },
  { name: 'Log', icon: List, path: '/log' }
];

const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => {
  const location = useLocation();

  return (
    <>
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <Link to="/" onClick={onItemClick}>
          <img 
            src="/lovable-uploads/514150da-8678-460a-bcbc-ee548d8d6098.png" 
            alt="Second Vintage" 
            className="max-h-12 max-w-full object-contain mb-2 cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
        <p className="text-slate-400 text-sm">CRM System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.name} className={item.opacity || ''}>
                <Link
                  to={item.path}
                  onClick={onItemClick}
                  className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-800 group ${
                    isActive 
                      ? 'text-white shadow-lg' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isActive ? `hsl(var(--theme-sidebar-active))` : undefined
                  }}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                  }`} />
                  <span className="truncate">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={onItemClick}
          className="flex items-center w-full px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

const MobileSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-64 text-white p-0 border-slate-700"
        style={{ backgroundColor: `hsl(var(--theme-sidebar-bg))` }}
      >
        <div className="flex flex-col min-h-full">
          <SidebarContent onItemClick={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Sidebar = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileSidebar />;
  }

  return (
    <div 
      className="w-64 text-white min-h-screen flex flex-col"
      style={{ backgroundColor: `hsl(var(--theme-sidebar-bg))` }}
    >
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
