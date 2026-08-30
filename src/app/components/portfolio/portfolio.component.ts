import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {
  switchToDesktop = output<void>();
  
  activeFilter = "all";
  loading = false;
  error = false;

  filterButtons = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Apps" },
  ];

  // Fallback list featuring actual projects
  projects = [
    {
      id: 1,
      category: "web",
      title: "Portfolio macOS Simulator",
      description: "A premium macOS desktop-style portfolio built with Angular 19, custom CSS transitions, drag-and-drop window layouts, and live terminal shell simulator.",
      technologies: ["Angular", "TypeScript", "SCSS"],
      categoryLabel: "Angular Application",
      metrics: "Live Simulation & UI",
      github: "https://github.com/prosenjitGravity/portfolio"
    },
    {
      id: 2,
      category: "web",
      title: "Ecommerce Microservices Platform",
      description: "Real-time order processing microservices platform featuring event-driven design, high performance, and Docker containers.",
      technologies: ["Node.js", "Express", "Kafka", "Docker", "PostgreSQL"],
      categoryLabel: "Microservices",
      metrics: "Event-driven architecture",
      github: "https://github.com/prosenjitGravity/ecommerce-microservices-platform"
    },
    {
      id: 3,
      category: "web",
      title: "OpenAssetX Tokenizer",
      description: "A decentralized asset tokenization platform that enables users to tokenize, list, and trade real-world assets using blockchain technology.",
      technologies: ["Solidity", "React", "Web3.js", "Ethereum"],
      categoryLabel: "Blockchain Web App",
      metrics: "Decentralized trading & tokens",
      github: "https://github.com/prosenjitGravity/OpenAssetX"
    },
    {
      id: 4,
      category: "web",
      title: "Alumni Network Backend",
      description: "Alumni Community platform backend engine for networking, real-time messaging feeds, and full-text search indexers.",
      technologies: ["Node.js", "Express", "MongoDB", "Socket.io"],
      categoryLabel: "REST API & WebSocket",
      metrics: "Social feed & communication",
      github: "https://github.com/prosenjitGravity/alumni-network-backend"
    },
    {
      id: 5,
      category: "web",
      title: "Quiz Platform",
      description: "Online interactive quiz platform featuring live multi-player scoreboards, customized questionnaires, and performance stats.",
      technologies: ["Angular", "TypeScript", "Node.js", "MySQL"],
      categoryLabel: "Full-Stack Web App",
      metrics: "Real-time Leaderboard",
      github: "https://github.com/prosenjitGravity/quiz_platform"
    }
  ];

  get filteredProjects() {
    if (this.activeFilter === "all") {
      return this.projects;
    }
    return this.projects.filter((project) => project.category === this.activeFilter);
  }

  setFilter(filterId: string) {
    this.activeFilter = filterId;
  }

  getTechIcon(tech: string): string {
    const icons: { [key: string]: string } = {
      'Angular': 'fab fa-angular',
      'TypeScript': 'fas fa-code',
      'SCSS': 'fab fa-sass',
      'Node.js': 'fab fa-node-js',
      'Express': 'fas fa-server',
      'Kafka': 'fas fa-stream',
      'Docker': 'fab fa-docker',
      'PostgreSQL': 'fas fa-database',
      'Solidity': 'fab fa-ethereum',
      'React': 'fab fa-react',
      'Web3.js': 'fas fa-link',
      'Ethereum': 'fab fa-ethereum',
      'MongoDB': 'fas fa-leaf',
      'Socket.io': 'fas fa-plug',
      'MySQL': 'fas fa-database',
      'Java': 'fab fa-java',
      'Spring Boot': 'fas fa-leaf'
    };
    return icons[tech] || 'fas fa-laptop-code';
  }

  getTechColorClass(tech: string): string {
    const colors: { [key: string]: string } = {
      'Angular': 'icon-angular',
      'TypeScript': 'icon-typescript',
      'SCSS': 'icon-sass',
      'Node.js': 'icon-node',
      'Express': 'icon-express',
      'Kafka': 'icon-kafka',
      'Docker': 'icon-docker',
      'PostgreSQL': 'icon-postgres',
      'Solidity': 'icon-ethereum',
      'React': 'icon-react',
      'Web3.js': 'icon-web3',
      'Ethereum': 'icon-ethereum',
      'MongoDB': 'icon-mongodb',
      'Socket.io': 'icon-socket',
      'MySQL': 'icon-mysql',
      'Java': 'icon-java',
      'Spring Boot': 'icon-springboot'
    };
    return colors[tech] || 'icon-default';
  }

  onProjectAction(project: any) {
    if (project.id === 1) {
      this.switchToDesktop.emit();
    }
  }
}
