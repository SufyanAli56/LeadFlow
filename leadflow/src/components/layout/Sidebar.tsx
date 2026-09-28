import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Inbox,
  Settings,
  Zap,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/leads", label: "Leads", icon: Users, end: false },
  { to: "/campaigns", label: "Campaigns", icon: Megaphone, end: false },
  { to: "/inbox", label: "Inbox", icon: Inbox, end: false },
  { to: "/settings", label: "Settings", icon: Settings, end: false },
];

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Zap className="h-4 w-4" strokeWidth={2.25} />
        </div>
        <span className="text-lg font-bold text-slate-900">LeadFlow</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <p className="text-xs text-slate-500">LeadFlow v0.1</p>
      </div>
    </aside>
  );
}

export default Sidebar;
