import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, Stethoscope, BarChart3 } from 'lucide-react'; // Alterado de Phone para Stethoscope
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Início', path: '/', icon: Home },
  { name: 'Triagem', path: '/triagem', icon: ClipboardList },
  { name: 'Teleorientação', path: '/teleorientacao', icon: Stethoscope }, // Ícone atualizado
  { name: 'Relatórios', path: '/relatorios', icon: BarChart3 },
];

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)]">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border border-clin-blue-100/80 bg-white/90 shadow-[0_20px_40px_-20px_rgba(0,29,70,0.45)] backdrop-blur-md dark:border-clin-blue-500/20 dark:bg-gray-900/90">
          <div className="flex items-center justify-between px-4 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-xs font-medium transition-all duration-200',
                    isActive
                      ? 'text-clin-blue-600 dark:text-clin-blue-400'
                      : 'text-gray-500 hover:text-clin-blue-500 dark:text-gray-400 dark:hover:text-clin-blue-300',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
