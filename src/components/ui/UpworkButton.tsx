'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface UpworkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const UpworkButton: React.FC<UpworkButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#14a800] text-white hover:bg-[#16a34a] focus:ring-[#14a800] shadow-sm',
    secondary: 'bg-white text-[#2c2c2c] border border-[#e5e5e5] hover:bg-[#f7f7f7] focus:ring-[#14a800] shadow-sm',
    outline: 'bg-transparent text-[#14a800] border border-[#14a800] hover:bg-[#14a800] hover:text-white focus:ring-[#14a800]',
    ghost: 'bg-transparent text-[#2c2c2c] hover:bg-[#f7f7f7] focus:ring-[#14a800]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 shadow-sm',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default UpworkButton;
