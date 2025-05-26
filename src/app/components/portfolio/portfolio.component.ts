import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit {
  activeFilter = "all"

  filterButtons = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Apps" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "design", label: "UI/UX Design" },
  ]

  projects = [
    {
      id: 1,
      category: "web",
      title: "Alumni Network Community",
      description: "A modern e-commerce solution with advanced features and seamless user experience.",
      image: "https://private-user-images.githubusercontent.com/90416951/247882200-5b4906d3-2777-4f15-a0ad-52b4a54fb20f.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDgyODQ3MzEsIm5iZiI6MTc0ODI4NDQzMSwicGF0aCI6Ii85MDQxNjk1MS8yNDc4ODIyMDAtNWI0OTA2ZDMtMjc3Ny00ZjE1LWEwYWQtNTJiNGE1NGZiMjBmLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA1MjYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNTI2VDE4MzM1MVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWIxY2MwNTM2ZmJmYzQ4ZDI3NTM3ZTlmMzgwYTE2NWQxNWZiNjUwNGQxNzk3YmUzOWFiYzk1ZTc5YmY4NDNlZWYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.Sqq46iPSyyQohMtDSDKBwhupjEhkAVfa3M4-wNvvFZk",
      technologies: ["MongoDB","Express","Angular", "Node.js" ],
      categoryLabel: "Web Application",
    },
    {
      id: 2,
      category: "mobile",
      title: "Fitness Tracker App",
      description: "A comprehensive fitness tracking app with personalized workout plans and progress monitoring.",
      image: "https://via.placeholder.com/600x400",
      technologies: ["React Native", "Firebase", "Redux"],
      categoryLabel: "Mobile Application",
    },
    {
      id: 3,
      category: "design",
      title: "Banking Dashboard",
      description: "A clean and intuitive dashboard design for financial management and analytics.",
      image: "https://via.placeholder.com/600x400",
      technologies: ["Figma", "Prototyping", "User Research"],
      categoryLabel: "UI/UX Design",
    },
  ]

  constructor(){};
  ngOnInit(): void {
    
  }

  get filteredProjects() {
    if (this.activeFilter === "all") {
      return this.projects
    }
    return this.projects.filter((project) => project.category === this.activeFilter)
  }

  setFilter(filterId: string) {
    this.activeFilter = filterId
  }

}
