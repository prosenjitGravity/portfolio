import { AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { TopbarComponent } from '../topbar/topbar.component';
import { CommonModule } from '@angular/common';
import { HeroComponent } from "../hero/hero.component";
import { AboutComponent } from "../about/about.component";
import { ServicesComponent } from "../services/services.component";
import { PortfolioComponent } from "../portfolio/portfolio.component";
import { TestimonialsComponent } from "../testimonials/testimonials.component";
import { ContactComponent } from "../contact/contact.component";
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TopbarComponent, HeroComponent, AboutComponent, ServicesComponent, PortfolioComponent, TestimonialsComponent, ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit,AfterViewInit {

  //dependencies
  @ViewChild('contentContainer') contentContainer!: ElementRef;

  //services
  private logger = inject(LoggerService);

  //variables
  activeSectionId: string = 'home';
  sections: string[] = ['home', 'about','services', 'skills', 'projects', 'contact'];
  scrollPosition: number = 0;
  loggingEnabled = true



  constructor(){

  }

  ngOnInit(): void {

    this.logger.info("UserComponent initialized", undefined, "UserComponent")
    this.loggingEnabled = this.logger.getConfig().enabled
    
  }
  handleData(data:string){
    console.log(data);
    this.scrollToSection(data);
    
  }

  ngAfterViewInit(): void {
    this.updateActiveSectionId();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.scrollPosition = window.pageYOffset;
    this.updateActiveSectionId();
  }
  private updateActiveSectionId() {
    const scrollPosition = window.pageYOffset + 100; // Offset for topbar
    
    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(this.sections[i]);
      if (section && section.offsetTop <= scrollPosition) {
        this.activeSectionId = this.sections[i];
        console.log(`Active Section: ${this.activeSectionId}`);
        
        break;
      }
    }
  }

  scrollToSection(id:string){
    this.logger.debug("Starting to load Scroll", undefined, "HomeComponent");
    

    const section = document.getElementById(id);
    if(section){
      section.scrollIntoView({ behavior: 'smooth',block: 'start', inline: 'nearest' });
    }
  }




}
