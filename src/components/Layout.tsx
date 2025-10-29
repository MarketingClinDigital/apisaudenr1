import React from 'react';
import ClinLogo from './ClinLogo';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-clin-blue-50 via-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-black">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pt-6 pb-[calc(env(safe-area-inset-bottom,0px)+5rem)]">
        <div className="flex justify-center">
          <ClinLogo imageClassName="h-16 w-auto md:h-20" />
        </div>
        <main className="relative mt-4 flex-1 space-y-6 overflow-x-hidden overflow-y-visible pb-6">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default Layout;