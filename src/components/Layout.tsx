import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ClinLogo from './ClinLogo';
import BottomNav from './BottomNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BACKOFFICE_AUTH_EVENT,
  BACKOFFICE_PROFILE_EVENT,
  BACKOFFICE_STORAGE_KEY,
  type BackofficeProfileAction,
} from '@/constants/backoffice';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBackoffice = location.pathname.startsWith('/backoffice');

  const handleProfileAction = (action: BackofficeProfileAction) => {
    if (typeof window === 'undefined') {
      return;
    }

    if (action === 'sign-out') {
      window.localStorage.removeItem(BACKOFFICE_STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent(BACKOFFICE_AUTH_EVENT, {
          detail: { authenticated: false },
        }),
      );
      navigate('/backoffice', { replace: true });
      return;
    }

    window.dispatchEvent(
      new CustomEvent(BACKOFFICE_PROFILE_EVENT, {
        detail: { action },
      }),
    );
  };

  if (isBackoffice) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-gray-950">
        <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
          <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <ClinLogo imageClassName="h-10 w-auto" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-clin-blue-400 focus:ring-offset-2">
                <Avatar className="h-11 w-11 border border-clin-blue-100 shadow-sm dark:border-gray-700">
                  <AvatarImage src="/backoffice-profile.png" alt="Perfil administrativo" />
                  <AvatarFallback className="bg-clin-blue-100 text-sm font-semibold text-clin-blue-700 dark:bg-clin-blue-500/20 dark:text-clin-blue-100">
                    AN
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      Ana Nogueira
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Diretoria de Saúde Ocupacional
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => handleProfileAction('view-profile')}>
                  Ver perfil
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleProfileAction('edit-profile')}>
                  Editar perfil
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleProfileAction('settings')}>
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onSelect={() => handleProfileAction('sign-out')}
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1400px] flex-col gap-6 px-6 pb-12 pt-10 lg:px-10">
          {children}
        </main>
      </div>
    );
  }

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
