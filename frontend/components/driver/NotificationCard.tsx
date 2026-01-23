'use client';

import { useState } from 'react';
import type { DriverNotification, NotificationStatus, ItemCategory } from '@/lib/types';
import { ITEM_CATEGORY_CONFIG } from '@/lib/types';
import { formatRelativeTime } from '@/lib/mock-data';

interface NotificationCardProps {
  notification: DriverNotification;
  onUpdateStatus: (id: string, status: NotificationStatus, notes?: string) => Promise<void>;
  isNew?: boolean;
}

export function NotificationCard({ notification, onUpdateStatus, isNew }: NotificationCardProps) {
  const [isExpanded, setIsExpanded] = useState(notification.status === 'pending' || isNew);
  const [isResponding, setIsResponding] = useState(false);
  const [responseNotes, setResponseNotes] = useState('');

  const categoryConfig = ITEM_CATEGORY_CONFIG[notification.category as ItemCategory];
  const isPending = notification.status === 'pending' || notification.status === 'acknowledged';

  const handleResponse = async (found: boolean) => {
    setIsResponding(true);
    await onUpdateStatus(
      notification.id,
      found ? 'found' : 'not_found',
      responseNotes || undefined
    );
    setIsResponding(false);
    setIsExpanded(false);
  };

  const getStatusConfig = () => {
    switch (notification.status) {
      case 'pending':
        return { label: 'Neu', color: 'bg-sbb-red', textColor: 'text-white' };
      case 'acknowledged':
        return { label: 'In Bearbeitung', color: 'bg-amber-500', textColor: 'text-white' };
      case 'found':
        return { label: 'Gefunden', color: 'bg-sbb-success', textColor: 'text-white' };
      case 'not_found':
        return { label: 'Nicht gefunden', color: 'bg-sbb-granite', textColor: 'text-white' };
      default:
        return { label: notification.status, color: 'bg-sbb-cloud', textColor: 'text-sbb-charcoal' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div
      className={`
        card-sbb overflow-hidden transition-all
        ${isNew ? 'ring-2 ring-sbb-red animate-pulse-subtle' : ''}
        ${notification.priority === 'urgent' && isPending ? 'border-l-4 border-l-sbb-red' : ''}
      `}
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        <div className="shrink-0 w-12 h-12 rounded-sbb-md bg-sbb-milk flex items-center justify-center text-2xl">
          {categoryConfig?.icon || '❓'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sbb-xs px-2 py-0.5 rounded-full font-medium ${statusConfig.color} ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
            {notification.priority === 'urgent' && isPending && (
              <span className="text-sbb-xs text-sbb-red font-medium">Dringend</span>
            )}
          </div>

          <h3 className="text-sbb-base font-semibold text-sbb-charcoal truncate">
            {notification.message}
          </h3>

          <p className="text-sbb-sm text-sbb-granite mt-0.5">
            {notification.location}
          </p>

          <p className="text-sbb-xs text-sbb-smoke mt-1">
            {formatRelativeTime(notification.createdAt)}
            {notification.passengerInfo && ` • ${notification.passengerInfo.tripRoute}`}
          </p>
        </div>

        <ChevronIcon
          className={`w-5 h-5 text-sbb-granite transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-sbb-cloud px-4 pb-4">
          {/* Passenger Info */}
          {notification.passengerInfo && (
            <div className="bg-sbb-milk rounded-sbb-md p-3 mt-3 space-y-2">
              <h4 className="text-sbb-xs font-semibold text-sbb-granite uppercase tracking-wide">
                Angaben des Fahrgastes
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sbb-sm">
                <div>
                  <p className="text-sbb-granite text-sbb-xs">Strecke</p>
                  <p className="font-medium text-sbb-charcoal">{notification.passengerInfo.tripRoute}</p>
                </div>
                <div>
                  <p className="text-sbb-granite text-sbb-xs">Zeit</p>
                  <p className="font-medium text-sbb-charcoal">{notification.passengerInfo.tripTime}</p>
                </div>
                {notification.passengerInfo.seatInfo && (
                  <div className="col-span-2">
                    <p className="text-sbb-granite text-sbb-xs">Position</p>
                    <p className="font-medium text-sbb-charcoal">{notification.passengerInfo.seatInfo}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Response Area for Pending */}
          {isPending && (
            <div className="mt-4 space-y-3">
              <textarea
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                placeholder="Optionale Notiz (z.B. wo gefunden, Zustand)..."
                className="input-sbb text-sbb-sm resize-none"
                rows={2}
              />

              <div className="flex gap-2">
                <button
                  onClick={() => handleResponse(true)}
                  disabled={isResponding}
                  className="flex-1 btn-sbb-primary flex items-center justify-center gap-2"
                >
                  {isResponding ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <CheckIcon className="w-5 h-5" />
                      Gefunden
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleResponse(false)}
                  disabled={isResponding}
                  className="flex-1 btn-sbb-secondary flex items-center justify-center gap-2"
                >
                  {isResponding ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <XIcon className="w-5 h-5" />
                      Nicht gefunden
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Response Display for Resolved */}
          {!isPending && notification.response && (
            <div className="mt-3 bg-sbb-milk rounded-sbb-md p-3">
              <h4 className="text-sbb-xs font-semibold text-sbb-granite uppercase tracking-wide mb-2">
                Ihre Rückmeldung
              </h4>
              {notification.response.notes && (
                <p className="text-sbb-sm text-sbb-charcoal">
                  {notification.response.notes}
                </p>
              )}
              {notification.respondedAt && (
                <p className="text-sbb-xs text-sbb-smoke mt-2">
                  Beantwortet {formatRelativeTime(notification.respondedAt)}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
