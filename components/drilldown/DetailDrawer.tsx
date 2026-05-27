'use client';

import React from 'react';
import DrilldownPanel from './DrilldownPanel';
import { AlertCardData } from '../alerts/AlertInboxPage';

interface DetailDrawerProps {
  alert: AlertCardData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DetailDrawer({ alert, isOpen, onClose }: DetailDrawerProps) {
  if (!isOpen || !alert) return null;

  return (
    <div className="absolute inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl border-l border-gray-200 z-30 transition-transform duration-300 transform translate-x-0">
      <DrilldownPanel alert={alert} onClose={onClose} />
    </div>
  );
}
