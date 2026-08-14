"use client";

import { useState, useEffect, useRef } from 'react';
import { subscribeUser, unsubscribeUser, sendNotification } from '@/app/actions/notifications';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export default function PushNotificationManager() {
  const [mounted, setMounted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [subscription, setSubscription] = useState<unknown>(null);
  const [isRinging, setIsRinging] = useState(false);
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [activeNotification, setActiveNotification] = useState<{title: string, body: string} | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
    // 1. Detect if running in the Mobile App Wrapper
    // @ts-expect-error window extension
    const isMobileMode = typeof window !== 'undefined' && (window.isMobileWebView || navigator.userAgent.includes('MedicarePlusMobile'));
    setIsMobile(isMobileMode);

    if (isMobileMode) {
      setIsSupported(true);
      // Listen for token relayed from the native bridge
      // @ts-expect-error window extension
      window.onNativeTokenReady = (token: string) => {
        console.log('[DEBUG] Token received from Native bridge:', token);
        setSubscription({ type: 'mobile', token });
        subscribeUser({ expoPushToken: token });
      };

      // Listen for incoming notifications to trigger the alarm UI
      // @ts-expect-error window extension
      window.onNativeNotification = (data: { title?: string, body?: string }) => {
        if (alarmEnabled) {
          triggerAlarm(data?.title || "Reminder", data?.body || "It's time for your medicine.");
        }
      };

      // If token is already available globally
      // @ts-expect-error window extension
      if (window.expoPushToken) {
        // @ts-expect-error window extension
        setSubscription({ type: 'mobile', token: window.expoPushToken });
      }
    } 
    // 2. Standard Web Push Support
    else if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();

      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'NOTIFICATION_RECEIVED' && event.data.alarm) {
          if (alarmEnabled) {
            triggerAlarm(event.data.title, event.data.body);
          }
        } else if (event.data.type === 'STOP_ALARM') {
          stopAlarm();
        }
      };

      navigator.serviceWorker.addEventListener('message', handleMessage);
      return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
    }
  }, [alarmEnabled]);

  const triggerAlarm = (title: string, body: string) => {
    setActiveNotification({ title, body });
    setIsRinging(true);
    
    if (!audioRef.current) {
      audioRef.current = new Audio('/alarm.mp3');
      audioRef.current.loop = true;
    }
    
    audioRef.current.play().catch(err => {
      console.warn('[DEBUG] Audio play failed (likely autoplay policy):', err);
    });
  };

  const stopAlarm = () => {
    setIsRinging(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.getSubscription();
    if (sub) {
      setSubscription(sub);
      await subscribeUser(JSON.parse(JSON.stringify(sub)));
    }
  }

  async function subscribe() {
    try {
      if (isMobile) {
        // In mobile, we wait for the native token. 
        // If it's not here, it means permissions weren't granted yet.
        alert("Please ensure notification permissions are granted in the app settings.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY!),
      });

      setSubscription(sub);
      await subscribeUser(JSON.parse(JSON.stringify(sub)));
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  }

  async function unsubscribe() {
    if (subscription) {
      if (isMobile) {
        // Simple client-side clear for mobile
        setSubscription(null);
      } else {
        const sub = subscription as PushSubscription;
        await sub.unsubscribe();
        await unsubscribeUser(sub.endpoint);
        setSubscription(null);
      }
    }
  }

  async function sendTestNotification() {
    if (subscription) {
      const result = await sendNotification("Testing your Medicare+ alerts!");
      if (result.success) {
        alert("Notification sent! Watch your phone.");
      } else {
        alert("Failed: " + result.error);
      }
    } else {
      alert("Please enable reminders first.");
    }
  }

  if (!mounted) return null;

  if (!isSupported) {
    return (
      <div className="glass-panel p-4 mt-6 text-center">
        <p className="text-sm text-muted">Reminders are only available in supported browsers or the Medicare+ App.</p>
      </div>
    );
  }

  return (
    <div className="notification-manager glass-panel p-4 mt-6">
      <h3 className="text-lg font-semibold mb-2">
        {isMobile ? "Mobile App Reminders" : "Medicine Reminders"}
      </h3>
      
      {subscription ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-green-600 flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            Alerts are active
          </p>
          
          <div className="flex items-center gap-2 mb-2 p-3 bg-white/5 rounded-xl border border-white/10">
            <input 
              type="checkbox" 
              id="alarm-toggle"
              checked={alarmEnabled}
              onChange={(e) => setAlarmEnabled(e.target.checked)}
              className="w-5 h-5 cursor-pointer accent-primary"
            />
            <label htmlFor="alarm-toggle" className="text-sm cursor-pointer font-medium">
              Play Alarm Sound
            </label>
          </div>

          <div className="flex gap-2">
            <button onClick={sendTestNotification} className="btn-secondary text-sm flex-1">
              Test Alert
            </button>
            <button onClick={unsubscribe} className="btn-close text-sm">
              Turn Off
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted mb-4">
            {isMobile 
              ? "Your app is ready for push alerts. Just tap the button to confirm."
              : "Never miss a dose. Get real-time alerts on your device."
            }
          </p>
          <button onClick={subscribe} className="btn-primary w-full py-3 font-semibold shadow-lg">
            {isMobile ? "Confirm Mobile Alerts" : "Enable Reminders"}
          </button>
        </div>
      )}

      {/* Ringing Overlay */}
      {isRinging && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="glass-panel max-w-sm w-full p-8 text-center shadow-2xl border-2 border-primary/30 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <span className="text-4xl">🔔</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Medication Time!</h2>
            <p className="text-lg text-primary font-medium mb-1">{activeNotification?.title}</p>
            <p className="text-muted-foreground mb-8">{activeNotification?.body}</p>
            
            <button 
              onClick={stopAlarm}
              className="btn-primary w-full py-4 text-xl font-bold rounded-2xl shadow-lg ring-4 ring-primary/20"
            >
              STOP ALARM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  if (typeof window === 'undefined') return new Uint8Array();
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
