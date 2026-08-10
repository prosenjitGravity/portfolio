import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent  implements OnInit{

  skillGroups = [
    {
      title: "Core Languages",
      icon: "fas fa-code",
      skills: [
        { name: "Node.js", highlight: true },
        { name: "TypeScript", highlight: true },
        { name: "JavaScript (ES6+)", highlight: false },
        { name: "Java", highlight: false },
        { name: "HTML5/CSS3", highlight: false },
        { name: "SCSS", highlight: false }
      ]
    },
    {
      title: "Frontend Ecosystem",
      icon: "fas fa-layer-group",
      skills: [
        { name: "Angular 17/19", highlight: true },
        { name: "RxJS", highlight: false },
        { name: "Tailwind CSS", highlight: false },
        { name: "Material UI", highlight: false },
        { name: "PrimeNG", highlight: false },
        { name: "Component Architecture", highlight: false },
        { name: "Unit Testing", highlight: false }
      ]
    },
    {
      title: "Backend & Real-Time",
      icon: "fas fa-server",
      skills: [
        { name: "Express.js", highlight: true },
        { name: "Spring Boot", highlight: false },
        { name: "RabbitMQ", highlight: true },
        { name: "Kafka", highlight: true },
        { name: "Socket.io / WebSockets", highlight: false },
        { name: "REST APIs", highlight: false }
      ]
    },
    {
      title: "Databases & Storage",
      icon: "fas fa-database",
      skills: [
        { name: "PostgreSQL", highlight: true },
        { name: "MySQL", highlight: false },
        { name: "MongoDB", highlight: false },
        { name: "Schema Indexing", highlight: false },
        { name: "Query Tuning", highlight: false },
        { name: "Transactional Integrity", highlight: false }
      ]
    },
    {
      title: "DevOps & Cloud",
      icon: "fas fa-cloud",
      skills: [
        { name: "AWS EC2 / S3 / ELB", highlight: true },
        { name: "Docker", highlight: true },
        { name: "GitHub Actions", highlight: false },
        { name: "GitLab CI/CD", highlight: false },
        { name: "Linux Basics", highlight: false }
      ]
    },
    {
      title: "Architecture & Security",
      icon: "fas fa-shield-alt",
      skills: [
        { name: "Event-Driven Arch", highlight: true },
        { name: "System Design", highlight: false },
        { name: "JWT & RBAC Auth", highlight: false },
        { name: "Audit Logging", highlight: false },
        { name: "Git / Jira / Agile", highlight: false }
      ]
    }
  ];

  constructor(){}

  ngOnInit(): void {
    
  }

}
