"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Today" },
  { href: "/habits", label: "Habits" },
  { href: "/stats", label: "Stats" },
  { href: "/settings", label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="bottom-nav">
      <div className="bottom-nav__inner">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              className="bottom-nav__link"
              data-active={active}
              href={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
