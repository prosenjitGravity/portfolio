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
      image: "/public/assets/images/alumni_network.png",
      technologies: ["MongoDB","Express","Angular", "Node.js" ],
      categoryLabel: "Web Application",
    },
    {
      id: 2,
      category: "web",
      title: "Web Messaging",
      description: "A comprehensive fitness tracking app with personalized workout plans and progress monitoring.",
      image: "/public/assets/images/web_messaging.png",
      technologies: ["Spring Boot","Java", "Angular", "H2 Database"],
      categoryLabel: "Web Application",
    },
    {
      id: 3,
      category: "web",
      title: "Quiz Application",
      description: "A clean and intuitive dashboard design for financial management and analytics.",
      image: "/public/assets/images/quiz_app.png",
      technologies: ["Figma", "Prototyping", "User Research"],
      categoryLabel: "Web Application",
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
