import { NavLink, Link } from "react-router-dom";
import { Home, List, Plus, Monitor, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/home", icon: Home },
  { name: "List", path: "/triagem", icon: List },
  { name: "Monitor", path: "/teleorientacao", icon: Monitor },
  { name: "Chart", path: "/relatorios", icon: TrendingUp },
];

const BottomNav = () => {
  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="mx-auto w-full max-w-md">
        <div className="relative flex items-center justify-around px-4 py-3 h-[78px]">
          {/* Left icons */}
          <div className="flex gap-8">
            {leftItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center transition-colors",
                    isActive ? "text-navy-dark" : "text-gray-400"
                  )
                }
              >
                <item.icon className="h-6 w-6" strokeWidth={2} />
              </NavLink>
            ))}
          </div>

          {/* Center add button */}
          <Link
            to="/triagem"
            className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          >
            <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#001d46] text-white shadow-[0_10px_30px_-10px_rgba(0,29,70,0.6)]">
              <Plus className="h-6 w-6" strokeWidth={2.5} />
            </div>
          </Link>

          {/* Right icons */}
          <div className="flex gap-8">
            {rightItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center transition-colors",
                    isActive ? "text-navy-dark" : "text-gray-400"
                  )
                }
              >
                <item.icon className="h-6 w-6" strokeWidth={2} />
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
