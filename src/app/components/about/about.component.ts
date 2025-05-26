import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {

  personalDetails = [
    { label: "Name", value: "Prosenjit Paul" },
    { label: "Email", value: "paul.prosenjitbit@gmail.com" },
    { label: "Phone", value: "+91 9933764953" },
    { label: "Location", value: "Kolkata, India" },
  ]

  socialLinks = [
    { icon: "fab fa-linkedin-in", url: "#" },
    { icon: "fab fa-github", url: "#" },
    { icon: "fab fa-twitter", url: "#" },
    { icon: "fab fa-dribbble", url: "#" },
  ];

  constructor(){}

  ngOnInit(): void {
    
  }

}
