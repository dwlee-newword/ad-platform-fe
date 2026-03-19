'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_NAME, NAV_ITEMS } from '@/constants/text';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex min-h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-100 p-6">
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-gray-600">
          {APP_NAME}
        </Link>
      </div>
      <div className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    isActive
                      ? 'flex items-center rounded-lg bg-primary-subtle px-4 py-3 text-sm font-semibold text-primary'
                      : 'flex items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
