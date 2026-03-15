import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { APP_NAME, APP_DESCRIPTION } from '@/constants/text';

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
