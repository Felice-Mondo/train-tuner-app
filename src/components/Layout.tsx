
import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import { AnimatedTransition } from "./AnimatedTransition";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          <AnimatedTransition>{children}</AnimatedTransition>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;
