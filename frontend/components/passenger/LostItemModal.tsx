'use client';

import { useState, useCallback } from 'react';
import type { Trip, LostItem, ItemCategory, ItemLocation } from '@/lib/types';
import { ITEM_CATEGORY_CONFIG, ITEM_LOCATION_CONFIG, ITEM_CATEGORIES, ITEM_LOCATIONS } from '@/lib/types';
import { formatTime, getTimeSinceTrip } from '@/lib/mock-data';
import { config } from '@/lib/config';

interface LostItemModalProps {
  trip: Trip;
  onClose: () => void;
  onSubmit: (item: LostItem) => void;
}

type Step = 'category' | 'details' | 'confirm' | 'success';

export function LostItemModal({ trip, onClose, onSubmit }: LostItemModalProps) {
  const [step, setStep] = useState<Step>('category');
  const [category, setCategory] = useState<ItemCategory | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<ItemLocation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { minutes, isUrgent } = getTimeSinceTrip(trip.arrivalTime);

  const handleSubmit = useCallback(async () => {
    if (!category || !description.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, config.demo.mockDelay));

    const newItem: LostItem = {
      id: `lost-${Date.now()}`,
      userId: 'user-001',
      tripId: trip.id,
      category,
      description,
      location: location || 'unknown',
      status: 'reported',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIsSubmitting(false);
    setStep('success');

    // Notify parent after showing success
    setTimeout(() => {
      onSubmit(newItem);
    }, 2000);
  }, [category, description, location, trip.id, onSubmit]);

  const handleSelectCategory = (cat: ItemCategory) => {
    setCategory(cat);
    setStep('details');
  };

  const handleBack = () => {
    if (step === 'details') setStep('category');
    if (step === 'confirm') setStep('details');
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className="modal-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-sbb-cloud">
          <div className="flex items-center justify-between">
            <h2 id="modal-title" className="text-sbb-xl font-semibold text-sbb-charcoal">
              🧳 Verlust melden
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-sbb-milk flex items-center justify-center text-sbb-granite hover:bg-sbb-cloud transition-colors"
              aria-label="Schliessen"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Urgency Alert */}
          {isUrgent && step !== 'success' && (
            <div className="bg-gradient-to-r from-[#FF5722] to-[#FF8A65] text-white rounded-sbb-lg p-5 mb-6 text-center">
              <div className="text-4xl mb-3">🚨</div>
              <h3 className="text-lg font-semibold mb-2">Schnell handeln!</h3>
              <p className="text-sbb-sm opacity-90">
                Ihr Zug hat vor {minutes} Minuten angehalten.
                {minutes <= 15
                  ? ' Fahrer kann jetzt noch suchen!'
                  : ' Je schneller Sie melden, desto besser die Chancen.'}
              </p>
            </div>
          )}

          {/* Trip Info (pre-filled) */}
          {step !== 'success' && (
            <div className="bg-sbb-milk rounded-sbb-md p-4 mb-6">
              <p className="text-sbb-xs text-sbb-granite mb-1">Betroffene Reise</p>
              <p className="text-sbb-base font-semibold text-sbb-charcoal">
                {trip.origin.name} → {trip.destination.name}
              </p>
              <p className="text-sbb-sm text-sbb-granite">
                {trip.vehicle.number} • {formatTime(trip.departureTime)}
                {trip.car && ` • Wagen ${trip.car}`}
                {trip.seat && ` • Platz ${trip.seat}`}
              </p>
            </div>
          )}

          {/* Step: Category Selection */}
          {step === 'category' && (
            <div>
              <h3 className="text-sbb-base font-semibold text-sbb-charcoal mb-4">
                Was haben Sie verloren?
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {ITEM_CATEGORIES.map((cat) => {
                  const cfg = ITEM_CATEGORY_CONFIG[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => handleSelectCategory(cat)}
                      className={`
                        bg-sbb-milk border-2 border-sbb-cloud rounded-sbb-md p-4 text-center
                        hover:border-sbb-red hover:bg-red-50 transition-all touch-feedback
                        ${category === cat ? 'border-sbb-red bg-red-50' : ''}
                      `}
                    >
                      <div className="text-3xl mb-2">{cfg.icon}</div>
                      <div className="text-sbb-xs font-medium text-sbb-charcoal">
                        {cfg.labelDe}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step: Details */}
          {step === 'details' && (
            <div>
              <button
                onClick={handleBack}
                className="text-sbb-sm text-sbb-granite hover:text-sbb-charcoal mb-4 flex items-center gap-1"
              >
                ← Zurück
              </button>

              <div className="space-y-5">
                <div>
                  <label className="block text-sbb-base font-semibold text-sbb-charcoal mb-2">
                    Beschreibung
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={`z.B. Schwarzes ${ITEM_CATEGORY_CONFIG[category!].labelDe}`}
                    className="input-sbb"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sbb-base font-semibold text-sbb-charcoal mb-2">
                    Wo genau?
                  </label>
                  <div className="space-y-2">
                    {ITEM_LOCATIONS.filter(l => l !== 'unknown').map((loc) => {
                      const cfg = ITEM_LOCATION_CONFIG[loc];
                      return (
                        <button
                          key={loc}
                          onClick={() => setLocation(loc)}
                          className={`
                            w-full text-left p-4 rounded-sbb-md border-2 transition-all
                            ${location === loc
                              ? 'border-sbb-red bg-red-50'
                              : 'border-sbb-cloud bg-sbb-milk hover:border-sbb-silver'
                            }
                          `}
                        >
                          <span className="text-sbb-base text-sbb-charcoal">
                            {cfg.labelDe}
                          </span>
                          {trip.seat && loc === 'seat' && (
                            <span className="text-sbb-sm text-sbb-granite ml-2">
                              (Platz {trip.seat})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!description.trim() || isSubmitting}
                  className="btn-sbb-primary w-full flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      🚨 Fahrer sofort benachrichtigen
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="text-7xl mb-6">✅</div>
              <h3 className="text-sbb-2xl font-semibold text-sbb-charcoal mb-3">
                Fahrer benachrichtigt!
              </h3>
              <p className="text-sbb-base text-sbb-granite mb-8 max-w-xs mx-auto">
                Der Zugführer wurde sofort informiert und wird bei der nächsten Gelegenheit nach Ihrem Gegenstand suchen.
              </p>

              <div className="bg-sbb-milk rounded-sbb-lg p-4 text-left mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-sbb-success/10 flex items-center justify-center">
                    <span className="text-sbb-success text-xl">📍</span>
                  </div>
                  <div>
                    <p className="text-sbb-sm font-semibold text-sbb-charcoal">Nächste Schritte</p>
                    <p className="text-sbb-xs text-sbb-granite">Sie werden per Push benachrichtigt</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sbb-sm text-sbb-granite ml-13">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sbb-cloud flex items-center justify-center text-xs">1</span>
                    Fahrer prüft bei Endstation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sbb-cloud flex items-center justify-center text-xs">2</span>
                    Status-Update in der App
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sbb-cloud flex items-center justify-center text-xs">3</span>
                    Abholung koordinieren
                  </li>
                </ul>
              </div>

              <button
                onClick={onClose}
                className="btn-sbb-secondary"
              >
                Verstanden
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
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
