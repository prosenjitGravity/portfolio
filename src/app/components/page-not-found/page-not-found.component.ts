import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  @ViewChild('cursorLight', { static: false }) cursorLight?: ElementRef;
  @ViewChild('errorCode', { static: false }) errorCode?: ElementRef;

  searchQuery = '';
  private mouseX = 0;
  private mouseY = 0;
  private lightX = 0;
  private lightY = 0;
  private animationId = 0;
  private mouseTimeout: any;

  systemTime = new Date().toLocaleTimeString();

  constructor(private router: Router) {}

  ngOnInit() {
    this.startCursorTracking();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.mouseTimeout) {
      clearTimeout(this.mouseTimeout);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    if (this.cursorLight) {
      this.cursorLight.nativeElement.style.opacity = '1';
    }

    if (this.mouseTimeout) {
      clearTimeout(this.mouseTimeout);
    }

    this.mouseTimeout = setTimeout(() => {
      if (this.cursorLight) {
        this.cursorLight.nativeElement.style.opacity = '0.6';
      }
    }, 2000);

    if (this.errorCode) {
      const x = (event.clientX - window.innerWidth / 2) / 45;
      const y = (event.clientY - window.innerHeight / 2) / 45;
      this.errorCode.nativeElement.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  private startCursorTracking() {
    const updateCursorLight = () => {
      this.lightX += (this.mouseX - this.lightX) * 0.1;
      this.lightY += (this.mouseY - this.lightY) * 0.1;

      if (this.cursorLight) {
        this.cursorLight.nativeElement.style.left = `${this.lightX}px`;
        this.cursorLight.nativeElement.style.top = `${this.lightY}px`;
      }

      this.animationId = requestAnimationFrame(updateCursorLight);
    };

    updateCursorLight();
  }

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  onSearchSubmit() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }
}
