import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Campus Portal',
  description: 'Student enrollment and academic portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body className="min-h-screen bg-gray-100 antialiased">
        <Providers>
          <div className="min-h-screen">
            {children}
          </div>
=======
      <body className="bg-gray-100 min-h-screen">
        <Providers>
          {children}
>>>>>>> 57fc38d9ff45965d75ad134eebf190823cbbebfe
        </Providers>
      </body>
    </html>
  );
}
