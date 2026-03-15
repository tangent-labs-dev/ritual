import { AppShell } from "@/src/components/layout/app-shell";
import { InstallPrompt } from "@/src/components/pwa/install-prompt";
import { ServiceWorkerRegister } from "@/src/components/pwa/service-worker-register";
import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   subsets: ["latin"],
//   variable: "--font-geist-sans",
// });

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ritual.local"),
  title: {
    default: "Ritual",
    template: "%s | Ritual",
  },
  description:
    "A minimalistic, open source, ad-free, no-tracker habit tracker built as a local-first PWA.",
  applicationName: "Ritual",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ritual",
  },
  icons: {
    icon: [
      { url: "/pwa-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa-icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.className} ${geistMono.variable}`}>
        <ServiceWorkerRegister />
        <InstallPrompt />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
