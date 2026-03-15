"use client";

import { useEffect, useState } from "react";
import {
  deleteAllCompletions,
  exportAllData,
  resetAllData,
} from "@/src/lib/repositories/completions";
import { useSettingsSummary } from "@/src/hooks/useSettingsSummary";

const GITHUB_URL = "https://github.com/tangent-labs-dev/ritual";

export default function SettingsPage() {
  const { habitCount, completionCount, loading } = useSettingsSummary();
  const [themeLabel, setThemeLabel] = useState("SYSTEM");
  const [runningAction, setRunningAction] = useState<null | "export" | "clear" | "reset">(
    null,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setThemeLabel(media.matches ? "DARK" : "LIGHT");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const hasData = habitCount > 0 || completionCount > 0;

  async function handleExport() {
    try {
      setRunningAction("export");
      const payload = await exportAllData();
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const fileName = `ritual-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;

      if (
        typeof navigator !== "undefined" &&
        "share" in navigator &&
        "canShare" in navigator
      ) {
        const file = new File([blob], fileName, { type: "application/json" });
        const canShare = navigator.canShare({ files: [file] });
        if (canShare) {
          await navigator.share({ files: [file], title: "Ritual backup" });
          return;
        }
      }

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setRunningAction(null);
    }
  }

  async function handleClearHistory() {
    if (!window.confirm("Clear all completion history and keep your habits?")) {
      return;
    }

    try {
      setRunningAction("clear");
      await deleteAllCompletions();
    } finally {
      setRunningAction(null);
    }
  }

  async function handleReset() {
    if (!window.confirm("Delete every habit and completion from this device?")) {
      return;
    }

    try {
      setRunningAction("reset");
      await resetAllData();
    } finally {
      setRunningAction(null);
    }
  }

  return (
    <div className="page">
      <header className="page-intro">
        <span className="section-label">Preferences</span>
        <h1 className="page-title">Settings</h1>
        <p className="page-copy">A simple home for app info and local data controls.</p>
      </header>

      <section className="info-grid">
        <article className="info-card">
          <h2 className="card-title">Appearance</h2>
          <div className="info-row">
            <div className="info-head">
              <span className="info-label">Current theme</span>
              <strong className="info-value">{themeLabel}</strong>
            </div>
            <p className="info-copy">Ritual follows your system preference.</p>
          </div>
        </article>

        <article className="info-card">
          <h2 className="card-title">Local data</h2>
          <div className="info-grid">
            <div className="info-row">
              <div className="info-head">
                <span className="info-label">Habits</span>
                <strong className="info-value">{loading ? "..." : habitCount}</strong>
              </div>
              <p className="info-copy">How many habits are stored in your browser.</p>
            </div>
            <div className="info-row">
              <div className="info-head">
                <span className="info-label">Completions</span>
                <strong className="info-value">{loading ? "..." : completionCount}</strong>
              </div>
              <p className="info-copy">Total daily check-ins recorded so far.</p>
            </div>
            <div className="info-actions" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <button
                className="action-button"
                disabled={!hasData || runningAction !== null}
                type="button"
                onClick={handleExport}
              >
                {runningAction === "export" ? "Exporting..." : "Export data"}
                <span className="action-button__hint">
                  Create a JSON backup and download it locally.
                </span>
              </button>
              <button
                className="action-button"
                disabled={completionCount === 0 || runningAction !== null}
                type="button"
                onClick={handleClearHistory}
              >
                {runningAction === "clear" ? "Clearing..." : "Clear history"}
                <span className="action-button__hint">
                  Remove every logged completion while keeping your habits.
                </span>
              </button>
              <button
                className="action-button danger-button"
                disabled={!hasData || runningAction !== null}
                type="button"
                onClick={handleReset}
              >
                {runningAction === "reset" ? "Resetting..." : "Reset all data"}
                <span className="action-button__hint">
                  Delete every habit and completion from this device.
                </span>
              </button>
            </div>
          </div>
        </article>

        <article className="info-card">
          <h2 className="card-title">About</h2>
          <div className="info-grid">
            <div className="info-row">
              <div className="info-head">
                <span className="info-label">Version</span>
                <strong className="info-value">1.0.0</strong>
              </div>
              <p className="info-copy">The current web release of Ritual.</p>
            </div>
            <div className="info-row">
              <div className="info-head">
                <span className="info-label">Storage</span>
                <strong className="info-value">Local</strong>
              </div>
              <p className="info-copy">Habits and completions live entirely in IndexedDB.</p>
            </div>
            <a className="link-row" href={GITHUB_URL} rel="noreferrer" target="_blank">
              Open repo
              <span className="link-row__hint">
                View the source or report a bug on GitHub.
              </span>
            </a>
          </div>
        </article>
      </section>
    </div>
  );
}
