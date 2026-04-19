import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationConfig, NotificationData } from '../model/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private config: NotificationConfig = {
    maxStack: 5,
    position: 'top-center',
    defaultDuration: 4000,
  };

  private notificationsSubject = new BehaviorSubject<NotificationData[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  // ─── Public API ───────────────────────────────────────────────

  configure(config: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  success(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'success', title, message, duration });
  }

  info(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'info', title, message, duration });
  }

  warning(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'warning', title, message, duration });
  }

  error(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'error', title, message, duration: duration ?? 0 });
  }

  notFound(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'not-found', title, message, duration });
  }

  loading(title: string, message?: string): string {
    return this.show({ type: 'loading', title, message, duration: 0, showProgress: false });
  }

  show(data: NotificationData): string {
    const id = data.id ?? this.generateId();
    const notification: NotificationData = {
      showProgress: true,
      duration: this.config.defaultDuration,
      ...data,
      id,
    };

    const current = this.notificationsSubject.getValue();

    // Enforce max stack — remove oldest if needed
    const maxStack = this.config.maxStack ?? 5;
    let updated = [notification, ...current];
    if (updated.length > maxStack) {
      const removed = updated.splice(maxStack);
      removed.forEach(n => this.clearTimer(n.id!));
    }

    this.notificationsSubject.next(updated);

    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => this.dismiss(id), notification.duration);
      this.timers.set(id, timer);
    }

    return id;
  }

  dismiss(id: string): void {
    this.clearTimer(id);
    const updated = this.notificationsSubject.getValue().filter(n => n.id !== id);
    this.notificationsSubject.next(updated);
  }

  dismissAll(): void {
    this.timers.forEach((_, id) => this.clearTimer(id));
    this.notificationsSubject.next([]);
  }

  update(id: string, data: Partial<NotificationData>): void {
    const updated = this.notificationsSubject.getValue().map(n =>
      n.id === id ? { ...n, ...data } : n
    );
    this.notificationsSubject.next(updated);
  }

  getPosition(): string {
    return this.config.position ?? 'top-center';
  }

  // ─── Private ──────────────────────────────────────────────────

  private clearTimer(id: string): void {
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id)!);
      this.timers.delete(id);
    }
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }
}