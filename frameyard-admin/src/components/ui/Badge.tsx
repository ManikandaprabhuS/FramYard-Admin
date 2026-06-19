import React from 'react';

type BadgeType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  type?: BadgeType;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, type = 'neutral', className = '' }) => {
  const styles: Record<BadgeType, string> = {
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    error: 'bg-error-container text-on-error-container dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-secondary-container text-on-secondary-container dark:bg-blue-900/30 dark:text-blue-400',
    neutral: 'bg-surface-variant text-on-surface-variant dark:bg-gray-800 dark:text-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase ${styles[type]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
