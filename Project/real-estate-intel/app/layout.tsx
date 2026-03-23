import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PropIntel — Real Estate Investment Intelligence',
  description: 'Analyze properties as investments with ROI, rental yield, and neighborhood growth scoring.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
