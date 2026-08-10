import { CommonModule } from '@angular/common';
import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  dataEmitter = output<string>();
  activeSectionId = input<string>('home');

  isMenuOpen = false;
  isScrolled = false;

  navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateTo(sectionId: string, event: Event) {
    event.preventDefault();
    this.isMenuOpen = false;
    this.dataEmitter.emit(sectionId);
  }
}
