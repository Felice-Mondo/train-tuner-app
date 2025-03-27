
import React from 'react';

interface LoginHeaderProps {
  title: string;
  subtitle: string;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 mb-2">
        {title}
      </div>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default LoginHeader;
