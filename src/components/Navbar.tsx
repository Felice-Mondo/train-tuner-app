
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Dumbbell, 
  Calendar, 
  History, 
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Exercises", href: "/exercises", icon: Dumbbell },
    { name: "Workouts", href: "/workouts", icon: Calendar },
    { name: "History", href: "/history", icon: History },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block",
          isScrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-md" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">TrainSync</span>
            </Link>
            <nav className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 rounded-full flex items-center space-x-1 transition-all",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <button className="ml-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                <LogOut className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 dark:bg-black/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center",
                isActive(item.href)
                  ? "text-primary"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 md:hidden p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-md"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </>
  );
};

export default Navbar;
