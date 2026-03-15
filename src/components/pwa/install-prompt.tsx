"use client";

import { useEffect, useMemo, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function isStandalone() {
  if (typeof window === "undefined") {
    return false;
  }

  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    function handleInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const isIos = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  }, []);

  const isAndroid = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return /android/.test(window.navigator.userAgent.toLowerCase());
  }, []);

  const showIosInstructions = isIos && !installed && !deferredPrompt;
  const showAndroidInstructions = isAndroid && !installed && !deferredPrompt;
  const visible =
    !dismissed &&
    !installed &&
    (Boolean(deferredPrompt) || showIosInstructions || showAndroidInstructions);

  if (!visible) {
    return null;
  }

  async function handleInstall() {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  }

  return (
    <section className="install-banner" role="status">
      <div className="install-banner__inner">
        <div className="install-banner__copy">
          <span className="install-banner__title">Install Ritual</span>
          <span className="install-banner__text">
            {deferredPrompt
              ? "Add Ritual to your home screen for a cleaner, app-like habit tracker."
              : showAndroidInstructions
                ? "On Android, open the browser menu and tap Install app or Add to Home screen if Chrome does not show the install sheet automatically."
              : "On iPhone or iPad, use Share and then Add to Home Screen to install Ritual."}
          </span>
        </div>

        <div className="install-banner__actions">
          {deferredPrompt ? (
            <button className="primary-button" type="button" onClick={handleInstall}>
              Install
            </button>
          ) : null}
          <button
            className="secondary-button"
            type="button"
            onClick={() => setDismissed(true)}
          >
            {deferredPrompt ? "Later" : "Got it"}
          </button>
        </div>
      </div>
    </section>
  );
}
