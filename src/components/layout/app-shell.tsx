import type { ReactNode } from "react";
import { BottomNav } from "@/src/components/layout/bottom-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <main className="page-shell">{children}</main>
      <BottomNav />
    </div>
  );
}
