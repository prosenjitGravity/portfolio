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
        { name: ".NET Core", highlight: true, icon: "fas fa-cube icon-dotnet" },
        { name: "Node.js", highlight: true, icon: "fab fa-node-js icon-node" },
        { name: "TypeScript", highlight: true, icon: "fas fa-code icon-typescript" },
        { name: "JavaScript (ES6+)", highlight: false, icon: "fab fa-js icon-javascript" },
        { name: "Java", highlight: true, icon: "fab fa-java icon-java" },
        { name: "HTML5/CSS3", highlight: false, icon: "fab fa-html5 icon-html" },
        { name: "SCSS", highlight: false, icon: "fab fa-sass icon-sass" }
      ]
    },
    {
      title: "Frontend Ecosystem",
      icon: "fas fa-layer-group",
      skills: [
        { name: "Angular 17/19", highlight: true, icon: "fab fa-angular icon-angular" },
        { name: "RxJS", highlight: false, icon: "fas fa-infinity icon-rxjs" },
        { name: "Tailwind CSS", highlight: false, icon: "fas fa-wind icon-tailwind" },
        { name: "Material UI", highlight: false, icon: "fas fa-shapes icon-mui" },
        { name: "PrimeNG", highlight: false, icon: "fas fa-gem icon-primeng" },
        { name: "Component Architecture", highlight: false, icon: "fas fa-cubes icon-architecture" },
        { name: "Unit Testing", highlight: false, icon: "fas fa-vial icon-testing" }
      ]
    },
    {
      title: "Backend & Real-Time",
      icon: "fas fa-server",
      skills: [
        { name: "Express.js", highlight: true, icon: "fab fa-node-js icon-express" },
        { name: "Spring Boot", highlight: true, icon: "fas fa-leaf icon-springboot" },
        { name: "RabbitMQ", highlight: true, icon: "fas fa-exchange-alt icon-rabbitmq" },
        { name: "Kafka", highlight: true, icon: "fas fa-stream icon-kafka" },
        { name: "Socket.io / WebSockets", highlight: false, icon: "fas fa-plug icon-socket" },
        { name: "REST APIs", highlight: false, icon: "fas fa-network-wired icon-api" }
      ]
    },
    {
      title: "Databases & Storage",
      icon: "fas fa-database",
      skills: [
        { name: "PostgreSQL", highlight: true, icon: "fas fa-database icon-postgres" },
        { name: "MySQL", highlight: false, icon: "fas fa-database icon-mysql" },
        { name: "MongoDB", highlight: false, icon: "fas fa-leaf icon-mongodb" },
        { name: "Schema Indexing", highlight: false, icon: "fas fa-search icon-search" },
        { name: "Query Tuning", highlight: false, icon: "fas fa-tachometer-alt icon-tuning" },
        { name: "Transactional Integrity", highlight: false, icon: "fas fa-clipboard-check icon-integrity" }
      ]
    },
    {
      title: "DevOps & Cloud",
      icon: "fas fa-cloud",
      skills: [
        { name: "AWS EC2 / S3 / ELB", highlight: true, icon: "fab fa-aws icon-aws" },
        { name: "Docker", highlight: true, icon: "fab fa-docker icon-docker" },
        { name: "GitHub Actions", highlight: false, icon: "fab fa-github icon-github" },
        { name: "GitLab CI/CD", highlight: false, icon: "fab fa-gitlab icon-gitlab" },
        { name: "Linux Basics", highlight: false, icon: "fab fa-linux icon-linux" }
      ]
    },
    {
      title: "Architecture & Security",
      icon: "fas fa-shield-alt",
      skills: [
        { name: "Event-Driven Arch", highlight: true, icon: "fas fa-project-diagram icon-architecture" },
        { name: "System Design", highlight: false, icon: "fas fa-sitemap icon-architecture" },
        { name: "JWT & RBAC Auth", highlight: false, icon: "fas fa-key icon-jwt" },
        { name: "Audit Logging", highlight: false, icon: "fas fa-history icon-history" },
        { name: "Git / Agile", highlight: false, icon: "fab fa-git-alt icon-git" }
      ]
    }
  ];

  constructor(){}

  ngOnInit(): void {
    
  }

}
