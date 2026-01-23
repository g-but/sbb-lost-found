'use client';

import type { Driver, Vehicle } from '@/lib/types';

interface DriverHeaderProps {
  driver: Driver;
  vehicle: Vehicle;
}

export function DriverHeader({ driver, vehicle }: DriverHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  return (
    <header className="bg-sbb-red text-white px-5 py-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sbb-sm opacity-90 mb-1">{getGreeting()}</p>
          <h1 className="text-xl font-semibold">{driver.name}</h1>
          <p className="text-sbb-sm opacity-80 mt-1">
            {driver.employeeNumber} • {driver.role === 'driver' ? 'Lokführer' : 'Zugbegleiter'}
          </p>
        </div>
        <div className="text-right">
          <div className="bg-white/20 rounded-sbb-md px-3 py-2">
            <VehicleIcon type={vehicle.type} className="w-5 h-5 mb-1 mx-auto" />
            <p className="text-sbb-xs font-medium">{vehicle.line}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 rounded-sbb-md p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-xl">🔔</span>
        </div>
        <div>
          <p className="text-sbb-sm font-medium">Verlustmeldungen</p>
          <p className="text-sbb-xs opacity-80">
            Echtzeitbenachrichtigungen für Ihren Zug
          </p>
        </div>
      </div>
    </header>
  );
}

function VehicleIcon({ type, className }: { type: 'train' | 'tram' | 'bus'; className?: string }) {
  if (type === 'tram') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="3" width="16" height="16" rx="2" />
        <path d="M8 19v2m8-2v2M4 12h16M9 7h6" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'bus') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 17v2m10-2v2" strokeLinecap="round" />
      </svg>
    );
  }

  // Default: train
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 18l-2 4h12l-2-4M3 6h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2V6zm0 0a2 2 0 012-2h14a2 2 0 012 2M8 6v4m8-4v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
