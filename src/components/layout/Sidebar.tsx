
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Library,
  Receipt,
  Settings,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-[80px]" : "w-[260px]",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <div className={cn("flex items-center space-x-3", collapsed && "justify-center w-full")}>
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">CC</span>
          </div>
          {!collapsed && <span className="text-lg font-semibold">CoachCenter</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("text-sidebar-foreground", collapsed && "hidden")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="absolute right-[-40px] top-5 text-sidebar-foreground"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </div>
      <nav className="flex-1 p-3 space-y-2">
        <SidebarLink to="/" icon={<LayoutDashboard />} label="Dashboard" collapsed={collapsed} />
        <SidebarLink to="/students" icon={<GraduationCap />} label="Students" collapsed={collapsed} />
        <SidebarLink to="/courses" icon={<Library />} label="Courses" collapsed={collapsed} />
        <SidebarLink to="/payments" icon={<Receipt />} label="Payments" collapsed={collapsed} />
        <SidebarLink to="/settings" icon={<Settings />} label="Settings" collapsed={collapsed} />
      </nav>
      <div className="p-3 mt-auto">
        <div className="glass rounded-xl p-4 text-center">
          {!collapsed && (
            <>
              <p className="text-xs text-muted-foreground">Coaching Center</p>
              <p className="font-medium">Admin Panel</p>
            </>
          )}
          {collapsed && <Settings className="mx-auto h-5 w-5" />}
        </div>
      </div>
    </div>
  );
}

type SidebarLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
};

function SidebarLink({ to, icon, label, collapsed }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          collapsed && "justify-center px-2"
        )
      }
    >
      <span className="flex h-5 w-5 items-center justify-center mr-3">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}
