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
  downloadCV() {
    const filePath = '/public/assets/files/Prosenjit_Resume.pdf'; // Path to the asset
    const fileName = 'Prosenjit_Resume_lts.pdf'; // Desired name for the downloaded file

    // Create a link element
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;

    // Append to the document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
