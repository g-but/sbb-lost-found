'use client';

import type { Trip } from '@/lib/types';
import { formatTime, getTimeSinceTrip } from '@/lib/mock-data';

interface TripCardProps {
  trip: Trip;
  variant: 'active' | 'compact';
  onReportLost: () => void;
  timeAgo?: string;
}

export function TripCard({ trip, variant, onReportLost, timeAgo }: TripCardProps) {
  const { isUrgent, isPriority } = trip.status === 'completed'
    ? getTimeSinceTrip(trip.arrivalTime)
    : { isUrgent: false, isPriority: false };

  if (variant === 'active') {
    return (
      <div className="bg-gradient-to-br from-[#1976D2] to-[#42A5F5] text-white rounded-sbb-lg p-5 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <TrainIcon className="w-5 h-5" />
            <span className="text-sbb-sm font-medium opacity-90">Aktuelle Reise</span>
          </div>
          <span className="text-sbb-sm opacity-90">{formatTime(trip.departureTime)}</span>
        </div>

        <h3 className="text-xl font-semibold mb-2">
          {trip.origin.name} → {trip.destination.name}
        </h3>

        <div className="flex justify-between text-sbb-sm opacity-90 mb-4">
          <span>{trip.vehicle.number} • Wagen {trip.car}</span>
          <span>Ankunft {formatTime(trip.arrivalTime)}</span>
        </div>

        <button
          onClick={onReportLost}
          className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-sbb-md transition-colors flex items-center justify-center gap-2"
        >
          <SearchIcon className="w-5 h-5" />
          Etwas verloren?
        </button>
      </div>
    );
  }

  // Compact variant for recent trips
  return (
    <div className="card-sbb p-4 touch-feedback">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <VehicleIcon type={trip.vehicle.type} className="w-4 h-4 text-sbb-granite" />
            <span className="text-sbb-xs text-sbb-granite">{trip.vehicle.line}</span>
            {timeAgo && (
              <span className="text-sbb-xs text-sbb-smoke">• {timeAgo}</span>
            )}
            {isUrgent && (
              <span className="text-sbb-xs text-sbb-red font-medium bg-red-50 px-2 py-0.5 rounded-full">
                Dringend
              </span>
            )}
          </div>

          <h4 className="text-sbb-base font-semibold text-sbb-charcoal truncate">
            {trip.origin.name} → {trip.destination.name}
          </h4>

          <p className="text-sbb-sm text-sbb-granite mt-1">
            {formatTime(trip.departureTime)} - {formatTime(trip.arrivalTime)}
            {trip.car && ` • Wagen ${trip.car}`}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onReportLost();
          }}
          className={`
            shrink-0 px-3 py-2 rounded-sbb-md text-sbb-sm font-medium transition-colors
            ${isUrgent
              ? 'bg-sbb-red text-white hover:bg-sbb-red-125'
              : isPriority
                ? 'bg-sbb-red/10 text-sbb-red hover:bg-sbb-red/20'
                : 'bg-sbb-cloud text-sbb-charcoal hover:bg-sbb-silver'
            }
          `}
          aria-label={`Verlust melden für Reise ${trip.origin.name} nach ${trip.destination.name}`}
        >
          {isUrgent ? '🚨 Melden' : 'Verlust?'}
        </button>
      </div>
    </div>
  );
}

function TrainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 18l-2 4h12l-2-4M3 6h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2V6zm0 0a2 2 0 012-2h14a2 2 0 012 2M8 6v4m8-4v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
  return <TrainIcon className={className} />;
}
