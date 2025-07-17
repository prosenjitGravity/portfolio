import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CelebrationData {
  amount: number
  message: string
  isVisible: boolean
}

@Injectable({
  providedIn: 'root'
})
export class CelebrationModalService {
  private celebrationSubject = new BehaviorSubject<CelebrationData>({
    amount: 0,
    message: "",
    isVisible: false,
  })

  public celebration$: Observable<CelebrationData> = this.celebrationSubject.asObservable()

  constructor() { }

  showCelebration(amount: number, message = "Your transaction has been processed successfully"): void {
    this.celebrationSubject.next({
      amount,
      message,
      isVisible: true,
    })
  }

  hideCelebration(): void {
    this.celebrationSubject.next({
      ...this.celebrationSubject.value,
      isVisible: false,
    })
  }

  getCurrentState(): CelebrationData {
    return this.celebrationSubject.value
  }
}
