import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AB Kreative | The Kinetic Luxury Sunroom',
  description: 'Interactive 3D presentation portal for The Kinetic Luxury Sunroom — Emirates Hills, Dubai',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
