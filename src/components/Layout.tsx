import React from 'react';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2FBFF] via-white to-[#F7F4FF] dark:from-gray-950 dark:via-gray-900 dark:to-black">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pt-6 pb-[calc(env(safe-area-inset-bottom,0px)+5rem)]">
        <main className="relative flex-1 space-y-6 overflow-x-hidden overflow-y-visible pb-6">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default Layout;
