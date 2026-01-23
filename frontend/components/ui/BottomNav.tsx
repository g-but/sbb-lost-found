'use client';

import { HomeIcon, TicketIcon, MapIcon, MoreIcon } from '@/components/ui/icons';

interface BottomNavProps {
  activeTab: 'home' | 'tickets' | 'journey' | 'more';
  onTabChange: (tab: 'home' | 'tickets' | 'journey' | 'more') => void;
}

const navItems = [
  { id: 'home' as const, label: 'Home', icon: HomeIcon },
  { id: 'tickets' as const, label: 'Tickets', icon: TicketIcon },
  { id: 'journey' as const, label: 'Reise', icon: MapIcon },
  { id: 'more' as const, label: 'Mehr', icon: MoreIcon },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Hauptnavigation">
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`
            flex-1 flex flex-col items-center py-2 px-1
            transition-colors duration-200
            ${activeTab === id ? 'text-sbb-red' : 'text-sbb-smoke hover:text-sbb-granite'}
          `}
          aria-current={activeTab === id ? 'page' : undefined}
        >
          <Icon className="w-6 h-6 mb-1" />
          <span className="text-[11px] font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
}
