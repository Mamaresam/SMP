import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SMP | Blockchain Intelligence',
  description: 'Professional blockchain analytics platform for wallets, transactions, token activity, and network health.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
