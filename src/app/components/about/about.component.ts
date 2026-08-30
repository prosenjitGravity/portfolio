import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  private readonly careerStartDate = new Date(2023, 7, 1)
  experienceBadge = ''
  experienceSummary = ''

  personalDetails = [
    { label: "Name", value: "Prosenjit Paul" },
    { label: "Email", value: "paul.prosenjitbit@gmail.com" },
    { label: "Location", value: "Kolkata, West Bengal, India" },
    { label: "Focus", value: "Node.js, Angular, Event-Driven Systems" },
  ]

  socialLinks = [
    { icon: "fab fa-linkedin-in", url: "https://www.linkedin.com/in/prosenjit-paul-0a82b6239" },
    { icon: "fab fa-github", url: "https://github.com/prosenjitGravity?tab=repositories" },
    { icon: "fas fa-file-alt", url: "/public/assets/files/Prosenjit_Resume.pdf" },
  ];

  constructor(){}

  ngOnInit(): void {
    const experience = this.calculateExperience(this.careerStartDate, new Date())
    this.experienceBadge = experience.short
    this.experienceSummary = experience.full
  }

  private calculateExperience(startDate: Date, currentDate: Date) {
    let years = currentDate.getFullYear() - startDate.getFullYear()
    let months = currentDate.getMonth() - startDate.getMonth()

    if (currentDate.getDate() < startDate.getDate()) {
      months -= 1
    }

    if (months < 0) {
      years -= 1
      months += 12
    }

    const yearLabel = years > 0 ? `${years} year${years === 1 ? '' : 's'}` : ''
    const monthLabel = months > 0 ? `${months} month${months === 1 ? '' : 's'}` : ''
    const full = [yearLabel, monthLabel].filter(Boolean).join(' ')

    return {
      short: `${years}Y ${months}M`,
      full: full || 'Less than a month'
    }
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
