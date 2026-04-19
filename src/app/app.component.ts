import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CelebrationModalComponent } from "./components/modals/celebration-modal/celebration-modal.component";
import { Subject } from 'rxjs';
import { NotificationService } from './shared/services/notification.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, CelebrationModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit,OnDestroy {
  title = 'my-portfolio';
  private http = inject(HttpClient);
  geolocationData:any;
  languagesList: string[] = [];
  selectedTab: string = 'network';

  prosenjitAscii = `██████  ██████   ██████  ███████ ███████ ███    ██      ██ ██ ████████ 
██   ██ ██   ██ ██    ██ ██      ██      ████   ██      ██ ██    ██    
██████  ██████  ██    ██ ███████ █████   ██ ██  ██      ██ ██    ██    
██      ██   ██ ██    ██      ██ ██      ██  ██ ██ ██   ██ ██    ██    
██      ██   ██  ██████  ███████ ███████ ██   ████  █████  ██    ██`


  private destroy$ = new Subject<void>();
  public notif = inject (NotificationService);
  constructor(){
    console.log(this.prosenjitAscii)
  }

  ngOnInit(): void {
    // this.getUserIpAddress()
    // this.languagesList = this.geolocationData.languages.split(',').slice(0, 10);

  }

  getUserIpAddress(){
    this.http.get<any>('https://ipapi.co/json').subscribe({
      next: (ipResponse) => {

        console.log('IP Address:', ipResponse); // Log the IP address for debugging
        
        this.geolocationData = ipResponse;
      },
      error: () => {
        alert('Could not fetch IP address.');
      },
    });
  }

  formatPopulation(population: number): string {
    return (population / 1000000).toFixed(1) + 'M';
  }

  formatArea(area: number): string {
    return area.toLocaleString() + ' km²';
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  getMapUrl(): string {
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${this.geolocationData.latitude},${this.geolocationData.longitude}`;
  }



  showSuccess() {
    this.notif.success('Changes saved', 'Your profile has been updated successfully.');
  }

  showInfo() {
    this.notif.info('New update available', 'Version 3.2.1 is ready to install.');
  }

  showWarning() {
    this.notif.warning('Storage almost full', 'You have used 90% of your 15 GB storage.');
  }

  showError() {
    this.notif.error('Upload failed', 'Could not connect to the server. Please try again.');
  }

  showNotFound() {
    this.notif.notFound('No results found', 'Try adjusting your search or filters.');
  }

  showLoading() {
    const id = this.notif.loading('Processing payment…');

    // Simulate async: resolve after 3s
    setTimeout(() => {
      this.notif.dismiss(id);
      this.notif.success('Payment successful', 'Your order #4821 has been confirmed.');
    }, 3000);
  }

  showWithAction() {
    this.notif.show({
      type: 'warning',
      title: 'Session expiring',
      message: 'You will be logged out in 2 minutes.',
      duration: 8000,
      action: {
        label: 'Stay logged in',
        callback: () => this.notif.success('Session extended', 'You have been kept logged in.')
      }
    });
  }

  showCustomDuration() {
    this.notif.show({
      type: 'info',
      title: 'Quick tip',
      message: 'Press ⌘K to open the command palette.',
      duration: 2000,
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
