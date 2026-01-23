'use client';

import type { User } from '@/lib/types';

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  return (
    <header className="header-sbb pb-8">
      <div className="flex justify-between items-center mb-5">
        <div className="text-[28px] font-black tracking-wide">SBB</div>
        <button
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
          aria-label="Profil öffnen"
        >
          <UserIcon className="w-5 h-5" />
        </button>
      </div>
      <p className="text-2xl font-light mb-1">{getGreeting()}</p>
      <p className="text-sbb-base opacity-90">{user.name}</p>
    </header>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
