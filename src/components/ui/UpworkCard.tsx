'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface UpworkCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const UpworkCard: React.FC<UpworkCardProps> = ({
  children,
  className,
  hover = false,
  padding = 'md',
  onClick
}) => {
  const baseClasses = 'bg-white border border-[#e5e5e5] rounded-lg shadow-sm';
  
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        baseClasses,
        hoverClasses,
        clickableClasses,
        paddingClasses[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default UpworkCard;
