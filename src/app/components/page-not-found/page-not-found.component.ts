import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  imports: [],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent implements OnInit,OnDestroy {

  @ViewChild('cursorLight', { static: true }) cursorLight!: ElementRef;
  @ViewChild('floatingElements', { static: true }) floatingElements!: ElementRef;
  @ViewChild('errorCode', { static: true }) errorCode!: ElementRef;
  @ViewChild('searchBox', { static: true }) searchBox!: ElementRef;

  private mouseX = 0;
  private mouseY = 0;
  private lightX = 0;
  private lightY = 0;
  private animationId: number = 0;
  private mouseTimeout: any;
  private floatingInterval: any;

  constructor() { }

  ngOnInit() {
    this.startCursorTracking();
    this.startFloatingElements();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.mouseTimeout) {
      clearTimeout(this.mouseTimeout);
    }
    if (this.floatingInterval) {
      clearInterval(this.floatingInterval);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    
    // Show cursor light
    this.cursorLight.nativeElement.style.opacity = '1';
    
    // Clear existing timeout
    if (this.mouseTimeout) {
      clearTimeout(this.mouseTimeout);
    }
    
    // Hide cursor light after 2 seconds of inactivity
    this.mouseTimeout = setTimeout(() => {
      this.cursorLight.nativeElement.style.opacity = '1';
    }, 2000);

    // Parallax effect for error code
    const x = (event.clientX - window.innerWidth / 2) / 50;
    const y = (event.clientY - window.innerHeight / 2) / 50;
    this.errorCode.nativeElement.style.transform = `translate(${x}px, ${y}px)`;
  }

  private startCursorTracking() {
    const updateCursorLight = () => {
      // Smooth follow animation
      this.lightX += (this.mouseX - this.lightX) * 0.1;
      this.lightY += (this.mouseY - this.lightY) * 0.1;
      
      this.cursorLight.nativeElement.style.left = this.lightX + 'px';
      this.cursorLight.nativeElement.style.top = this.lightY + 'px';
      
      this.animationId = requestAnimationFrame(updateCursorLight);
    };
    
    updateCursorLight();
  }

  private startFloatingElements() {
    const createFloatingElement = () => {
      const element = document.createElement('div');
      element.className = 'floating-element';
      element.style.left = Math.random() * 100 + '%';
      element.style.animationDelay = Math.random() * 20 + 's';
      element.style.animationDuration = (15 + Math.random() * 10) + 's';
      this.floatingElements.nativeElement.appendChild(element);
      
      // Remove element after animation
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 25000);
    };

    // Create floating elements periodically
    this.floatingInterval = setInterval(createFloatingElement, 2000);
  }

  onNavHover(event: Event, isEntering: boolean) {
    const element = event.target as HTMLElement;
    if (isEntering) {
      element.style.transform = 'translateY(-2px) scale(1.05)';
    } else {
      element.style.transform = 'translateY(0) scale(1)';
    }
  }

  onSearchFocus() {
    this.searchBox.nativeElement.style.transform = 'scale(1.02)';
  }

  onSearchBlur() {
    this.searchBox.nativeElement.style.transform = 'scale(1)';
  }

}
