'use client';

import { useState, useCallback, useEffect } from 'react';
import { StatusBar } from '@/components/ui/StatusBar';
import { Header } from '@/components/passenger/Header';
import { TripCard } from '@/components/passenger/TripCard';
import { LostItemModal } from '@/components/passenger/LostItemModal';
import { BottomNav, type NavTab } from '@/components/ui/BottomNav';
import { Toast } from '@/components/ui/Toast';
import { mockUser, mockTrips, mockActiveTrip, formatRelativeTime } from '@/lib/mock-data';
import { config } from '@/lib/config';
import { UI_LABELS } from '@/lib/labels';
import type { Trip, LostItem } from '@/lib/types';

// Tab content components
function PlanenTab() {
  return (
    <div className="px-4 pt-4 pb-6">
      <div className="bg-white rounded-sbb-lg p-4 shadow-sbb-card mb-4">
        <h2 className="text-sbb-lg font-semibold text-sbb-charcoal mb-3">Verbindung suchen</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-sbb-milk rounded-sbb-md">
            <div className="w-2 h-2 rounded-full bg-sbb-success" />
            <input
              type="text"
              placeholder="Von"
              className="flex-1 bg-transparent text-sbb-base outline-none"
            />
          </div>
          <div className="flex items-center gap-3 p-3 bg-sbb-milk rounded-sbb-md">
            <div className="w-2 h-2 rounded-full bg-sbb-red" />
            <input
              type="text"
              placeholder="Nach"
              className="flex-1 bg-transparent text-sbb-base outline-none"
            />
          </div>
        </div>
        <button className="w-full mt-4 bg-sbb-red text-white py-3 rounded-sbb-md font-medium">
          Verbindung suchen
        </button>
      </div>
      <p className="text-sbb-sm text-sbb-granite text-center">
        Demo: Planen-Tab (Verbindungssuche)
      </p>
    </div>
  );
}

function EasyRideTab() {
  return (
    <div className="px-4 pt-4 pb-6">
      <div className="bg-white rounded-sbb-lg p-6 shadow-sbb-card text-center">
        <div className="w-16 h-16 bg-sbb-milk rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎫</span>
        </div>
        <h2 className="text-sbb-lg font-semibold text-sbb-charcoal mb-2">EasyRide</h2>
        <p className="text-sbb-sm text-sbb-granite mb-4">
          Check-in, reisen, Check-out. Der Fahrpreis wird automatisch berechnet.
        </p>
        <button className="w-full bg-sbb-red text-white py-3 rounded-sbb-md font-medium">
          EasyRide starten
        </button>
      </div>
      <p className="text-sbb-sm text-sbb-granite text-center mt-4">
        Demo: EasyRide-Tab
      </p>
    </div>
  );
}

function BilletteTab() {
  return (
    <div className="px-4 pt-4 pb-6">
      <div className="bg-white rounded-sbb-lg p-4 shadow-sbb-card mb-4">
        <h2 className="text-sbb-lg font-semibold text-sbb-charcoal mb-3">Meine Billette</h2>
        <div className="flex gap-2 mb-4">
          <button className="flex-1 py-2 px-3 bg-sbb-red text-white rounded-sbb-md text-sbb-sm font-medium">
            Gültig
          </button>
          <button className="flex-1 py-2 px-3 bg-sbb-milk text-sbb-granite rounded-sbb-md text-sbb-sm font-medium">
            Abgelaufen
          </button>
        </div>
        <div className="text-center py-8">
          <span className="text-4xl mb-2 block">🎫</span>
          <p className="text-sbb-sm text-sbb-granite">Keine aktiven Billette</p>
        </div>
      </div>
      <p className="text-sbb-sm text-sbb-granite text-center">
        Demo: Billette & Abos Tab
      </p>
    </div>
  );
}

function ShopTab() {
  return (
    <div className="px-4 pt-4 pb-6">
      <div className="bg-white rounded-sbb-lg p-4 shadow-sbb-card mb-4">
        <h2 className="text-sbb-lg font-semibold text-sbb-charcoal mb-3">Shop & Services</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '🎫', label: 'Tageskarten' },
            { icon: '🚲', label: 'Velo-Tageskarte' },
            { icon: '🐕', label: 'Hunde-Tageskarte' },
            { icon: '🔍', label: 'Fundservice' },
          ].map((item) => (
            <div key={item.label} className="p-4 bg-sbb-milk rounded-sbb-md text-center">
              <span className="text-2xl mb-2 block">{item.icon}</span>
              <span className="text-sbb-sm text-sbb-charcoal">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-sbb-sm text-sbb-granite text-center">
        Demo: Shop & Services Tab
      </p>
    </div>
  );
}

interface ProfilTabProps {
  onOpenFundservice?: () => void;
}

function ProfilTab({ onOpenFundservice }: ProfilTabProps) {
  const user = mockUser;
  return (
    <div className="px-4 pt-4 pb-6">
      <div className="bg-white rounded-sbb-lg p-4 shadow-sbb-card mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-sbb-milk rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h2 className="text-sbb-lg font-semibold text-sbb-charcoal">{user.name}</h2>
            <p className="text-sbb-sm text-sbb-granite">{user.swissPassId || 'SwissPass'}</p>
          </div>
        </div>
        <div className="space-y-2">
          {/* Fundservice - Lost & Found */}
          {onOpenFundservice && (
            <button
              onClick={onOpenFundservice}
              className="w-full p-3 bg-sbb-red/10 rounded-sbb-md flex items-center gap-3 hover:bg-sbb-red/15 transition-colors"
            >
              <span className="text-xl">🧳</span>
              <div className="flex-1 text-left">
                <span className="text-sbb-base font-medium text-sbb-red">Fundservice</span>
                <p className="text-sbb-xs text-sbb-granite">Verlust melden oder Status prüfen</p>
              </div>
              <span className="text-sbb-red">›</span>
            </button>
          )}
          {[
            'Persönliche Daten',
            'Zahlungsmittel',
            'Benachrichtigungen',
            'Einstellungen',
            'Hilfe & Kontakt',
          ].map((item) => (
            <div key={item} className="p-3 bg-sbb-milk rounded-sbb-md flex justify-between items-center">
              <span className="text-sbb-base text-sbb-charcoal">{item}</span>
              <span className="text-sbb-granite">›</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-sbb-sm text-sbb-granite text-center">
        Demo: Profil-Tab
      </p>
    </div>
  );
}

export default function PassengerApp() {
  const [showLostModal, setShowLostModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('reisen');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);

  // Load trips data (simulates API call)
  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, config.demo.mockDelay));
      setCurrentTrip(mockActiveTrip);
      setRecentTrips(mockTrips);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleReportLost = useCallback((trip: Trip) => {
    setSelectedTrip(trip);
    setShowLostModal(true);
  }, []);

  const handleSubmitReport = useCallback((item: LostItem) => {
    setShowLostModal(false);
    setToast({
      message: UI_LABELS.lostItem.driverNotifiedMessage,
      type: 'success',
    });

    // Demo: Simulate staff searching
    setTimeout(() => {
      setToast({
        message: 'Personal sucht aktiv nach Ihrem Gegenstand',
        type: 'info',
      });
    }, config.timing.demoNotificationDelay);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowLostModal(false);
    setSelectedTrip(null);
  }, []);

  // Render loading skeleton for Reisen tab
  const renderLoadingSkeleton = () => (
    <div className="px-4 pt-4">
      {/* Active trip skeleton */}
      <div className="bg-sbb-cloud rounded-sbb-lg p-5 mb-4 animate-pulse">
        <div className="h-4 bg-sbb-silver rounded w-1/3 mb-4" />
        <div className="h-6 bg-sbb-silver rounded w-2/3 mb-2" />
        <div className="h-4 bg-sbb-silver rounded w-1/2 mb-4" />
        <div className="h-12 bg-sbb-silver rounded" />
      </div>

      {/* Recent trips skeleton */}
      <div className="h-5 bg-sbb-cloud rounded w-1/3 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-sbb-lg p-4 animate-pulse shadow-sbb-card">
            <div className="flex gap-3">
              <div className="w-4 h-4 bg-sbb-cloud rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-sbb-cloud rounded w-3/4" />
                <div className="h-3 bg-sbb-cloud rounded w-1/2" />
              </div>
              <div className="w-16 h-8 bg-sbb-cloud rounded-sbb-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render the Reisen (Trips) tab content
  const renderReisenTab = () => {
    if (isLoading) {
      return renderLoadingSkeleton();
    }

    return (
      <div className="px-4 pt-4 pb-6">
        {/* Current Journey (if active) - no lost button here, user is on the train */}
        {currentTrip && currentTrip.status === 'active' && (
          <section className="mb-4">
            <TripCard
              trip={currentTrip}
              variant="active"
            />
          </section>
        )}

        {/* Einzelreisen (Individual Trips) Section - past trips */}
        <section>
          <h2 className="text-sbb-sm font-medium text-sbb-granite mb-3">
            Letzte Reisen
          </h2>
          <div className="space-y-2">
            {recentTrips.slice(0, 5).map((trip, index) => (
              <TripCard
                key={trip.id}
                trip={trip}
                variant="compact"
                // Only show lost button on most recent trip (index 0)
                onReportLost={index === 0 ? () => handleReportLost(trip) : undefined}
                timeAgo={formatRelativeTime(trip.arrivalTime)}
              />
            ))}
          </div>
        </section>
      </div>
    );
  };

  // Render current tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'planen':
        return <PlanenTab />;
      case 'reisen':
        return renderReisenTab();
      case 'easyride':
        return <EasyRideTab />;
      case 'billette':
        return <BilletteTab />;
      case 'shop':
        return <ShopTab />;
      case 'profil':
        return <ProfilTab onOpenFundservice={() => {
          // Open lost item modal with most recent trip
          if (recentTrips.length > 0) {
            handleReportLost(recentTrips[0]);
          }
        }} />;
      default:
        return renderReisenTab();
    }
  };

  return (
    <>
      {/* iOS Status Bar */}
      <StatusBar />

      {/* SBB Header */}
      <Header user={mockUser} />

      {/* Main Content */}
      <main className="pb-20 overflow-y-auto hide-scrollbar bg-sbb-milk min-h-[calc(100vh-120px)]">
        {renderTabContent()}
      </main>

      {/* Bottom Navigation - 6 tabs like real SBB app */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Lost Item Modal */}
      {showLostModal && (
        <LostItemModal
          trip={selectedTrip || recentTrips[0]}
          onClose={handleCloseModal}
          onSubmit={handleSubmitReport}
        />
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
