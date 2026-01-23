'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { api, WebSocketEvent, WebSocketConnection } from '../api';

interface UseWebSocketOptions {
  onMessage?: (event: WebSocketEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  autoConnect?: boolean;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastEvent: WebSocketEvent | null;
  connect: () => void;
  disconnect: () => void;
  send: (data: unknown) => void;
}

/**
 * React hook for WebSocket connection to notification service.
 * Provides real-time updates for lost item status changes and driver notifications.
 */
export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    autoConnect = true,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<WebSocketEvent | null>(null);
  const connectionRef = useRef<WebSocketConnection>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const handleMessage = useCallback((event: WebSocketEvent) => {
    setLastEvent(event);
    onMessage?.(event);
  }, [onMessage]);

  const handleConnect = useCallback(() => {
    setIsConnected(true);
    reconnectAttemptsRef.current = 0;
    onConnect?.();
  }, [onConnect]);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    onDisconnect?.();

    // Auto-reconnect with exponential backoff
    if (autoConnect && reconnectAttemptsRef.current < 5) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectAttemptsRef.current++;
        connect();
      }, delay);
    }
  }, [autoConnect, onDisconnect]);

  const handleError = useCallback((error: Event) => {
    console.error('WebSocket error:', error);
    onError?.(error);
  }, [onError]);

  const connect = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.close();
    }

    connectionRef.current = api.connectWebSocket(
      handleMessage,
      handleError,
      handleConnect,
      handleDisconnect
    );
  }, [handleMessage, handleError, handleConnect, handleDisconnect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    reconnectAttemptsRef.current = 5; // Prevent auto-reconnect
    connectionRef.current?.close();
    connectionRef.current = null;
    setIsConnected(false);
  }, []);

  const send = useCallback((data: unknown) => {
    connectionRef.current?.send(data);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]); // Intentionally excluding connect/disconnect to avoid loops

  return {
    isConnected,
    lastEvent,
    connect,
    disconnect,
    send,
  };
}

/**
 * Hook specifically for driver notifications.
 * Filters WebSocket events to only handle driver-relevant notifications.
 */
export function useDriverNotifications(
  onNewNotification?: (notification: unknown) => void
) {
  const handleMessage = useCallback((event: WebSocketEvent) => {
    if (event.type === 'driver_notification' || event.type === 'lost_item_created') {
      onNewNotification?.(event.data);
    }
  }, [onNewNotification]);

  return useWebSocket({
    onMessage: handleMessage,
  });
}

/**
 * Hook for passenger status updates.
 * Filters WebSocket events to only handle status changes for reported items.
 */
export function useItemStatusUpdates(
  itemIds: string[],
  onStatusChange?: (itemId: string, status: string) => void
) {
  const handleMessage = useCallback((event: WebSocketEvent) => {
    if (event.type === 'lost_item_status_updated') {
      const data = event.data as { itemId?: string; lostItemId?: string; status?: string };
      const itemId = data.itemId || data.lostItemId;
      if (itemId && itemIds.includes(itemId) && data.status) {
        onStatusChange?.(itemId, data.status);
      }
    }
  }, [itemIds, onStatusChange]);

  return useWebSocket({
    onMessage: handleMessage,
  });
}
