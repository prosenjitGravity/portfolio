import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-mouse-tracker',
  imports: [CommonModule],
  templateUrl: './mouse-tracker.component.html',
  styleUrl: './mouse-tracker.component.scss'
})
export class MouseTrackerComponent implements OnInit,OnDestroy {

  //variables 
 cursorX = 0;
cursorY = 0;
isCursorHighlighted = false;
private timeoutId: any;


  constructor(){}

  ngOnInit(): void {
    this.resetHighlightTimer();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
    this.isCursorHighlighted = false;
    this.resetHighlightTimer();
  }

  resetHighlightTimer(): void {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.isCursorHighlighted = true;
    }, 6000); // 1 minute
  }
}
