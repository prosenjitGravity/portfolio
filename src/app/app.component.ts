import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CelebrationModalComponent } from "./components/modals/celebration-modal/celebration-modal.component";

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, CelebrationModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
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


}
