'use client';

import React from 'react';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';

interface UpworkPageTemplateProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  filters?: React.ReactNode;
  emptyState?: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
  };
}

const UpworkPageTemplate: React.FC<UpworkPageTemplateProps> = ({
  title,
  description,
  children,
  headerAction,
  filters,
  emptyState
}) => {
  return (
    <div className="space-y-6">
      {/* Header - Upwork Style */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2c2c]">{title}</h1>
          {description && (
            <p className="text-[#525252] mt-1">{description}</p>
          )}
        </div>
        {headerAction && (
          <div>{headerAction}</div>
        )}
      </div>

      {/* Filters */}
      {filters && (
        <UpworkCard>
          {filters}
        </UpworkCard>
      )}

      {/* Content */}
      {children}

      {/* Empty State */}
      {emptyState && (
        <UpworkCard>
          <div className="p-12 text-center">
            <div className="mb-4">{emptyState.icon}</div>
            <h3 className="text-lg font-medium text-[#2c2c2c] mb-2">{emptyState.title}</h3>
            <p className="text-[#525252] mb-4">{emptyState.description}</p>
            {emptyState.action && (
              <div>{emptyState.action}</div>
            )}
          </div>
        </UpworkCard>
      )}
    </div>
  );
};

export default UpworkPageTemplate;
