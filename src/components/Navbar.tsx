
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useMediaQuery } from "@/hooks/use-mobile";
import { 
  Home, 
  Menu, 
  Dumbbell, 
  Calendar, 
  History, 
  User as UserIcon, 
  LogOut
} from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, active, onClick }: NavItemProps) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        active
          ? "bg-primary/10 text-primary hover:bg-primary/15"
          : "hover:bg-muted"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Navbar = () => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  
  const isPathActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      to: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
      requiresAuth: true,
      active: isPathActive("/dashboard"),
    },
    {
      to: "/exercises",
      icon: <Dumbbell className="w-5 h-5" />,
      label: "Exercises",
      requiresAuth: true,
      active: isPathActive("/exercises"),
    },
    {
      to: "/workouts",
      icon: <Calendar className="w-5 h-5" />,
      label: "Workouts",
      requiresAuth: true,
      active: isPathActive("/workouts"),
    },
    {
      to: "/history",
      icon: <History className="w-5 h-5" />,
      label: "History",
      requiresAuth: true,
      active: isPathActive("/history"),
    },
    {
      to: "/profile",
      icon: <UserIcon className="w-5 h-5" />,
      label: "Profile",
      requiresAuth: true,
      active: isPathActive("/profile"),
    },
  ];

  // Mobile navigation with sheet
  if (isMobile) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="border-b p-6">
                  <SheetTitle>FitTrack</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 p-4">
                  {navigationItems
                    .filter(item => !item.requiresAuth || isAuthenticated)
                    .map((item) => (
                      <NavItem
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        active={item.active}
                        onClick={() => setOpen(false)}
                      />
                    ))}
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  ) : (
                    <NavItem
                      to="/login"
                      icon={<UserIcon className="w-5 h-5" />}
                      label="Login"
                      active={isPathActive("/login")}
                      onClick={() => setOpen(false)}
                    />
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" className="text-xl font-bold">
              FitTrack
            </Link>
          </div>

          {isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarFallback>
                    {user.email ? user.email.substring(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!isAuthenticated && (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </header>
    );
  }

  // Desktop navigation
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            FitTrack
          </Link>

          <nav className="flex items-center gap-1">
            {navigationItems
              .filter(item => !item.requiresAuth || isAuthenticated)
              .map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={item.active}
                />
              ))}
          </nav>
        </div>

        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar>
                  <AvatarFallback>
                    {user.email ? user.email.substring(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 cursor-pointer"
                onClick={logout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
