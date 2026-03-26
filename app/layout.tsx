import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web3 Toolkit MVP",
  description: "Starter SaaS MVP for wallet tracking, airdrop tracking and Discord alerts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
