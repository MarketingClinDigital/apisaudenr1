import React from 'react';
import { NavLink } from 'react-router-dom';
import ClinLogo from './ClinLogo';
import { Home, ClipboardList, Phone, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const navItems = [
    { name: 'Início', path: '/', icon: Home },
    { name: 'Triagem', path: '/triagem', icon: ClipboardList },
    { name: 'Teleorientação', path: '/teleorientacao', icon: Phone },
    { name: 'Relatórios', path: '/relatorios', icon: BarChart3 },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <ClinLogo />
        <nav className="flex space-x-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-clin-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;