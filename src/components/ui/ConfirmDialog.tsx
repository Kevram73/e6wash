'use client';

import React from 'react';
import Modal from './Modal';
import UpworkButton from './UpworkButton';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'danger',
  isLoading = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-blue-500" />;
    }
  };

  const getButtonVariant = () => {
    switch (type) {
      case 'danger':
        return 'danger' as const;
      case 'warning':
        return 'warning' as const;
      default:
        return 'primary' as const;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>
        
        <h3 className="text-lg font-semibold text-[#2c2c2c] mb-2">
          {title}
        </h3>
        
        <p className="text-[#525252] mb-6">
          {message}
        </p>
        
        <div className="flex justify-center space-x-3">
          <UpworkButton
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </UpworkButton>
          
          <UpworkButton
            variant={getButtonVariant()}
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Suppression...
              </>
            ) : (
              confirmText
            )}
          </UpworkButton>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
