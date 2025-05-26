import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  dataEmitter = output<string>();

  activeSectionId = input<string>("home"); // Default active link


  constructor() { }

  ngOnInit(): void {
    // Initialization logic here
  }

  // Add any methods or properties needed for the topbar component

  toggleMenu() {
    const menu = document.querySelector('.mobile-toggle');
    if (menu) {
      menu.classList.toggle('active');
      const menuList = document.querySelector('.navbar-menu');
      if (menuList) {
        menuList.classList.toggle('active');
      }
      
    //   document.querySelector('.navbar-menu').classList.toggle('active');
    //   this.classList.toggle('active');
    // });
    }
  }

  sendDataLinkId(data:string){
    this.activeSectionId.bind(data); // Update the active link
    this.dataEmitter.emit(data);
  }

}
