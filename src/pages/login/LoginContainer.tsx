
import React from 'react';
import { motion } from "framer-motion";

interface LoginContainerProps {
  children: React.ReactNode;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card rounded-2xl shadow-soft p-8"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default LoginContainer;
