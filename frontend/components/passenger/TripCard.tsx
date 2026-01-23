'use client';

import type { Trip } from '@/lib/types';
import { formatTime, getTimeSinceTrip } from '@/lib/mock-data';
import { UI_LABELS } from '@/lib/labels';
import { TrainIcon, VehicleIcon } from '@/components/ui/icons';

interface TripCardProps {
  trip: Trip;
  variant: 'active' | 'compact';
  onReportLost?: () => void;
  timeAgo?: string;
}

export function TripCard({ trip, variant, onReportLost, timeAgo }: TripCardProps) {
  const { isUrgent, isPriority } = trip.status === 'completed'
    ? getTimeSinceTrip(trip.arrivalTime)
    : { isUrgent: false, isPriority: false };

  // Active trip - user is currently ON the train
  // Show live tracking info, NOT "lost something?" (that makes no sense while on the train)
  if (variant === 'active') {
    return (
      <div className="bg-white rounded-sbb-lg shadow-sbb-card overflow-hidden">
        {/* Header with live indicator */}
        <div className="bg-sbb-charcoal text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-sbb-success animate-pulse" />
            <span className="text-sbb-sm font-medium">Live</span>
          </div>
          <span className="text-sbb-sm">{trip.vehicle.line} → {trip.destination.name}</span>
        </div>

        {/* Trip details */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-sbb-red rounded-sbb-md flex items-center justify-center">
              <TrainIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sbb-base font-semibold text-sbb-charcoal">
                {trip.origin.name} → {trip.destination.name}
              </h3>
              <p className="text-sbb-sm text-sbb-granite">
                {trip.vehicle.number} • {UI_LABELS.trip.car} {trip.car}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-1 bg-sbb-cloud rounded-full mb-2">
            <div className="absolute left-0 top-0 h-full bg-sbb-red rounded-full" style={{ width: '45%' }} />
          </div>

          <div className="flex justify-between text-sbb-sm">
            <span className="text-sbb-granite">{formatTime(trip.departureTime)}</span>
            <span className="text-sbb-charcoal font-medium">{UI_LABELS.trip.arrival} {formatTime(trip.arrivalTime)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant for completed/recent trips
  // ONLY completed trips should show the "report lost" option
  const showLostButton = trip.status === 'completed' && onReportLost;

  return (
    <div className="bg-white rounded-sbb-lg shadow-sbb-card p-4">
      <div className="flex items-start gap-3">
        {/* Vehicle icon */}
        <div className="w-8 h-8 bg-sbb-milk rounded-sbb-md flex items-center justify-center shrink-0">
          <VehicleIcon type={trip.vehicle.type} className="w-5 h-5 text-sbb-granite" />
        </div>

        {/* Trip info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sbb-sm font-medium text-sbb-charcoal">{trip.vehicle.line}</span>
            {timeAgo && (
              <span className="text-sbb-xs text-sbb-smoke">{timeAgo}</span>
            )}
            {isUrgent && (
              <span className="text-sbb-xs text-white bg-sbb-red px-1.5 py-0.5 rounded font-medium">
                !
              </span>
            )}
          </div>

          <h4 className="text-sbb-base text-sbb-charcoal">
            {trip.origin.name} → {trip.destination.name}
          </h4>

          <p className="text-sbb-sm text-sbb-granite">
            {formatTime(trip.departureTime)} – {formatTime(trip.arrivalTime)}
          </p>
        </div>

        {/* Lost button - only for completed trips */}
        {showLostButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReportLost();
            }}
            className={`
              shrink-0 px-3 py-1.5 rounded-sbb-md text-sbb-sm font-medium transition-colors
              ${isUrgent
                ? 'bg-sbb-red text-white'
                : isPriority
                  ? 'bg-sbb-red/10 text-sbb-red border border-sbb-red/20'
                  : 'bg-sbb-milk text-sbb-granite hover:bg-sbb-cloud'
              }
            `}
            aria-label={UI_LABELS.a11y.reportLossFor(trip.origin.name, trip.destination.name)}
          >
            {isUrgent ? '!' : ''} {UI_LABELS.actions.reportLoss}
          </button>
        )}
      </div>
    </div>
  );
}
