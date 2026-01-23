'use client';

import { useState, useEffect, useCallback } from 'react';
import { StatusBar } from '@/components/ui/StatusBar';
import { Header } from '@/components/passenger/Header';
import { TripCard } from '@/components/passenger/TripCard';
import { LostItemModal } from '@/components/passenger/LostItemModal';
import { BottomNav } from '@/components/ui/BottomNav';
import { Toast } from '@/components/ui/Toast';
import { QuickActions } from '@/components/passenger/QuickActions';
import { mockUser, mockTrips, mockActiveTrip, formatRelativeTime } from '@/lib/mock-data';
import type { Trip, LostItem } from '@/lib/types';

export default function PassengerApp() {
  const [showLostModal, setShowLostModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [reportedItem, setReportedItem] = useState<LostItem | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'tickets' | 'journey' | 'more'>('home');

  // Demo: Use active trip if available
  const currentTrip = mockActiveTrip;
  const recentTrips = mockTrips;

  const handleReportLost = useCallback((trip: Trip) => {
    setSelectedTrip(trip);
    setShowLostModal(true);
  }, []);

  const handleSubmitReport = useCallback((item: LostItem) => {
    setReportedItem(item);
    setShowLostModal(false);
    setToast({
      message: 'Fahrer wurde sofort benachrichtigt!',
      type: 'success',
    });

    // Demo: Simulate driver finding item
    setTimeout(() => {
      setToast({
        message: 'Fahrer sucht aktiv nach Ihrem Gegenstand',
        type: 'info',
      });
    }, 3000);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowLostModal(false);
    setSelectedTrip(null);
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <>
      {/* iOS Status Bar */}
      <StatusBar />

      {/* SBB Header */}
      <Header user={mockUser} />

      {/* Main Content */}
      <main className="pb-24 overflow-y-auto hide-scrollbar">
        {/* Current Journey (if active) */}
        {currentTrip && currentTrip.status === 'active' && (
          <section className="px-6 -mt-4 relative z-10">
            <TripCard
              trip={currentTrip}
              variant="active"
              onReportLost={() => handleReportLost(currentTrip)}
            />
          </section>
        )}

        {/* Quick Actions */}
        <QuickActions onLostFound={() => setShowLostModal(true)} />

        {/* Recent Trips */}
        <section className="px-6 pb-6">
          <h2 className="text-sbb-xl font-semibold text-sbb-charcoal mb-4">
            Letzte Reisen
          </h2>
          <div className="space-y-3">
            {recentTrips.slice(0, 5).map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                variant="compact"
                onReportLost={() => handleReportLost(trip)}
                timeAgo={formatRelativeTime(trip.arrivalTime)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
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
