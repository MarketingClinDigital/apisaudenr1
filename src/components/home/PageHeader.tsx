import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

export function PageHeader() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Home", path: "/home" },
    { name: "Triagem", path: "/triagem" },
    { name: "Teleorientação", path: "/teleorientacao" },
    { name: "Relatórios", path: "/relatorios" },
    { name: "Início", path: "/" },
  ];

  return (
    <header className="flex items-center justify-between">
      <img
        src="/api-saude-logo.svg"
        alt="API Saúde"
        className="h-[38px] w-auto"
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <div className="flex flex-col gap-[3px]">
              <div className="h-[3px] w-5 rounded-full bg-navy-dark" />
              <div className="h-[3px] w-5 rounded-full bg-navy-dark" />
              <div className="h-[3px] w-5 rounded-full bg-navy-dark" />
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px]">
          <nav className="flex flex-col gap-4 mt-8">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "bg-navy-dark text-white"
                      : "text-navy-dark hover:bg-gray-100"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
