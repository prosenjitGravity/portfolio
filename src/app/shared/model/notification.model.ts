export type NotificationType = 'success' | 'info' | 'warning' | 'error' | 'not-found' | 'loading';

export interface NotificationData {
  id?: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;      // ms, 0 = persistent
  showProgress?: boolean;
  icon?: string;          // override default icon
  action?: {
    label: string;
    callback: () => void;
  };
}

export interface NotificationConfig {
  maxStack?: number;       // max visible at once (default 5)
  position?: 'top-center' | 'top-left' | 'top-right';
  defaultDuration?: number;
}