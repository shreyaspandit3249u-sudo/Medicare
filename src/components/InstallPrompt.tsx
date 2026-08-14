"use client";

import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [mounted, setMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<unknown>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    setIsIOS(isIOSDevice);

    // Detect if already installed (standalone)
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && (navigator as unknown as { standalone: boolean }).standalone);
    setIsStandalone(isStandaloneMode);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isStandaloneMode) setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS, we can show it even without the event if not standalone
    if (isIOSDevice && !isStandaloneMode) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // iOS doesn't have a prompt, so we just show instructions which are already visible
      return;
    }

    if (!deferredPrompt) return;
    (deferredPrompt as { prompt: () => void; userChoice: Promise<{ outcome: string }> }).prompt();
    const { outcome } = await (deferredPrompt as { prompt: () => void; userChoice: Promise<{ outcome: string }> }).userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!mounted || !isVisible || isStandalone) return null;

  return (
    <div className="install-banner glass-panel">
      <div className="flex-row justify-between gap-4">
        <div className="flex-row gap-2">
          <div className="install-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </div>
          <div>
            <p className="text-sm font-semibold">Install Medicare+</p>
            {isIOS ? (
              <p className="text-xs text-muted">Tap Share then &quot;Add to Home Screen&quot;</p>
            ) : (
              <p className="text-xs text-muted">Add to home screen for quick access</p>
            )}
          </div>
        </div>
        <div className="flex-row gap-2">
          <button onClick={() => setIsVisible(false)} className="btn-close">
            Later
          </button>
          {!isIOS && (
            <button onClick={handleInstallClick} className="btn-install-small">
              Install
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .install-banner {
          position: fixed;
          top: env(safe-area-inset-top, 20px);
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 500px;
          padding: 12px 14px;
          z-index: 1000;
          animation: slideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(-120%); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }

        .install-icon {
          background: linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%);
          color: white;
          padding: 8px;
          border-radius: 12px;
          display: flex;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .btn-install-small {
          background: var(--primary);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8125rem;
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }

        .btn-close {
          color: #64748b;
          font-size: 0.8125rem;
          font-weight: 500;
          padding: 8px;
        }

        .font-semibold { font-weight: 600; }
        .text-xs { font-size: 0.75rem; }
      `}</style>
    </div>
  );
}
