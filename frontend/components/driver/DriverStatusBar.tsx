'use client';

import type { Vehicle } from '@/lib/types';

interface DriverStatusBarProps {
  vehicle: Vehicle;
  pendingCount: number;
  isOnline: boolean;
}

export function DriverStatusBar({ vehicle, pendingCount, isOnline }: DriverStatusBarProps) {
  return (
    <div className="bg-sbb-charcoal text-white px-4 py-2 flex items-center justify-between text-sbb-xs">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-sbb-success' : 'bg-sbb-smoke'}`} />
        <span className="opacity-80">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
      <div className="font-medium">
        {vehicle.number}
      </div>
      <div className="flex items-center gap-1.5">
        {pendingCount > 0 && (
          <span className="bg-sbb-red px-1.5 py-0.5 rounded-full text-white font-medium">
            {pendingCount}
          </span>
        )}
        <span className="opacity-80">offen</span>
      </div>
    </div>
  );
}
