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
  ]

  projects = [
    {
      id: 1,
      category: "web",
      title: "E-Commerce Inventory Management System (IMS)",
      description: "Mission-critical inventory and order management system capable of real-time stock tracking, warehouse allocation, purchase order processing, and transactional audit trails.",
      technologies: ["Node.js", "TypeScript", "PostgreSQL", "Kafka", "Docker", "Angular"],
      categoryLabel: "Web Application / System",
      metrics: "Real-time stock & transactions",
      github: "https://github.com/prosenjitGravity?tab=repositories"
    },
    {
      id: 2,
      category: "web",
      title: "Alumni Community Platform",
      description: "LinkedIn-inspired networking platform featuring real-time messaging, directory indexing, job posting feeds, content sharing, and JWT role-based security.",
      technologies: ["MongoDB", "Express.js", "Angular", "Node.js", "Socket.IO"],
      categoryLabel: "Web Application",
      metrics: "Real-time communication & RBAC",
      github: "https://github.com/prosenjitGravity?tab=repositories"
    },
    {
      id: 3,
      category: "web",
      title: "Cliky CRM Platform",
      description: "Enterprise Customer Relationship Management platform for sales pipelines, task management, role-based controls, follow-ups, and interactive analytics dashboards.",
      technologies: ["Node.js", "Express.js", "MySQL", "AWS S3"],
      categoryLabel: "Web Application",
      metrics: "Sales pipe & interactive metrics",
      github: "https://github.com/prosenjitGravity?tab=repositories"
    }
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
