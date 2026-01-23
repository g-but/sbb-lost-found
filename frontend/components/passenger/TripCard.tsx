'use client';

import type { Trip } from '@/lib/types';
import { formatTime, getTimeSinceTrip } from '@/lib/mock-data';
import { UI_LABELS } from '@/lib/labels';
import { TrainIcon, VehicleIcon, SearchIcon } from '@/components/ui/icons';

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
      <div className="bg-gradient-to-br from-sbb-blue to-sbb-blue text-white rounded-sbb-lg p-5 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <TrainIcon className="w-5 h-5" />
            <span className="text-sbb-sm font-medium opacity-90">{UI_LABELS.trip.currentTrip}</span>
          </div>
          <span className="text-sbb-sm opacity-90">{formatTime(trip.departureTime)}</span>
        </div>

        <h3 className="text-xl font-semibold mb-2">
          {trip.origin.name} → {trip.destination.name}
        </h3>

        <div className="flex justify-between text-sbb-sm opacity-90 mb-4">
          <span>{trip.vehicle.number} • {UI_LABELS.trip.car} {trip.car}</span>
          <span>{UI_LABELS.trip.arrival} {formatTime(trip.arrivalTime)}</span>
        </div>

        <button
          onClick={onReportLost}
          className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-sbb-md transition-colors flex items-center justify-center gap-2"
        >
          <SearchIcon className="w-5 h-5" />
          {UI_LABELS.actions.lostSomething}
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
                {UI_LABELS.lostItem.urgent}
              </span>
            )}
          </div>

          <h4 className="text-sbb-base font-semibold text-sbb-charcoal truncate">
            {trip.origin.name} → {trip.destination.name}
          </h4>

          <p className="text-sbb-sm text-sbb-granite mt-1">
            {formatTime(trip.departureTime)} - {formatTime(trip.arrivalTime)}
            {trip.car && ` • ${UI_LABELS.trip.car} ${trip.car}`}
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
          aria-label={UI_LABELS.a11y.reportLossFor(trip.origin.name, trip.destination.name)}
        >
          {isUrgent ? UI_LABELS.actions.reportUrgent : UI_LABELS.actions.reportLoss}
        </button>
      </div>
    </div>
  );
}
