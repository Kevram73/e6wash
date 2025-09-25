'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface UpworkInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const UpworkInput: React.FC<UpworkInputProps> = ({
  label,
  error,
  helperText,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#2c2c2c] mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2.5 border border-[#e5e5e5] rounded-lg text-[#2c2c2c] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent transition-colors duration-200',
          error && 'border-[#ef4444] focus:ring-[#ef4444]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[#ef4444]">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-[#737373]">{helperText}</p>
      )}
    </div>
  );
};

export default UpworkInput;
