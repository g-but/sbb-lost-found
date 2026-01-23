'use client';

import { useState, useCallback, useEffect } from 'react';
import { StatusBar } from '@/components/ui/StatusBar';
import { Header } from '@/components/passenger/Header';
import { TripCard } from '@/components/passenger/TripCard';
import { LostItemModal } from '@/components/passenger/LostItemModal';
import { BottomNav } from '@/components/ui/BottomNav';
import { Toast } from '@/components/ui/Toast';
import { QuickActions } from '@/components/passenger/QuickActions';
import { mockUser, mockTrips, mockActiveTrip, formatRelativeTime } from '@/lib/mock-data';
import { config } from '@/lib/config';
import { UI_LABELS } from '@/lib/labels';
import type { Trip, LostItem } from '@/lib/types';

export default function PassengerApp() {
  const [showLostModal, setShowLostModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [reportedItem, setReportedItem] = useState<LostItem | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'tickets' | 'journey' | 'more'>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);

  // Load trips data (simulates API call)
  useEffect(() => {
    const loadData = async () => {
      // Simulate API delay
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
    setReportedItem(item);
    setShowLostModal(false);
    setToast({
      message: UI_LABELS.lostItem.driverNotifiedMessage,
      type: 'success',
    });

    // Demo: Simulate driver searching
    setTimeout(() => {
      setToast({
        message: 'Fahrer sucht aktiv nach Ihrem Gegenstand',
        type: 'info',
      });
    }, config.timing.demoNotificationDelay);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowLostModal(false);
    setSelectedTrip(null);
  }, []);

  // Toast auto-dismisses itself via Toast component

  return (
    <>
      {/* iOS Status Bar */}
      <StatusBar />

      {/* SBB Header */}
      <Header user={mockUser} />

      {/* Main Content */}
      <main className="pb-24 overflow-y-auto hide-scrollbar">
        {isLoading ? (
          // Loading skeleton
          <div className="px-6 pt-2">
            {/* Active trip skeleton */}
            <div className="bg-sbb-cloud rounded-sbb-lg p-5 mb-6 animate-pulse">
              <div className="h-4 bg-sbb-silver rounded w-1/3 mb-4" />
              <div className="h-6 bg-sbb-silver rounded w-2/3 mb-2" />
              <div className="h-4 bg-sbb-silver rounded w-1/2 mb-4" />
              <div className="h-12 bg-sbb-silver rounded" />
            </div>

            {/* Quick actions skeleton */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-sbb-lg p-5 animate-pulse">
                  <div className="w-12 h-12 bg-sbb-cloud rounded-sbb-md mb-3" />
                  <div className="h-4 bg-sbb-cloud rounded w-3/4 mb-2" />
                  <div className="h-3 bg-sbb-cloud rounded w-1/2" />
                </div>
              ))}
            </div>

            {/* Recent trips skeleton */}
            <div className="h-6 bg-sbb-cloud rounded w-1/3 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-sbb-lg p-4 animate-pulse">
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
        ) : (
          <>
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
                {UI_LABELS.trip.recentTrips}
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
          </>
        )}
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
