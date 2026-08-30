import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-experience',
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {
  jobs = [
    {
      role: "Software Developer",
      company: "SISL Infotech Pvt. Ltd. (NIC)",
      period: "Aug 2024 — Present | Kolkata, India",
      points: [
        "Contributing to a <strong>secure government financial management platform</strong>, building high-reliability solutions for mission-critical financial operations and digital governance workflows.",
        "Engineered <strong>multi-tier scheme fund transfer mechanisms</strong>, orchestrating automated, validated disbursements from <strong>State level down to District, Block, and Village levels</strong> according to scheme-specific financial rules.",
        "Architected granular <strong>user mapping and administrative hierarchy models</strong>, enforcing strict multi-level role-based access control (RBAC), verification gates, and audit trails.",
        "Developed and enhanced high-throughput <strong>RESTful APIs using .NET Core</strong> alongside responsive, modular <strong>Angular</strong> interfaces focused on scalability, performance, and maintainability.",
        "Implemented resilient <strong>RabbitMQ asynchronous message queues</strong> to decouple heavy financial processing tasks, enabling fault tolerance and automated retry handling.",
        "Integrated core services with <strong>authorized government portals and external APIs</strong>, ensuring strict data encryption, integrity, and reliable inter-system communication.",
        "Strengthened platform security through robust <strong>authorization, input validation, cryptographic checks, and immutable audit logs</strong> for sensitive public fund operations."
      ],
      techStack: ".NET Core, Angular, RabbitMQ, PostgreSQL, REST APIs, Microservices"
    },
    {
      role: "Junior Software Developer",
      company: "Phloxblog",
      period: "Aug 2023 — Aug 2024 | Kolkata, India",
      points: [
        "Engineered core modules for an end-to-end <strong>real-time e-auction platform</strong> managing asset catalogs, participant bidding lifecycles, and concurrent live auction sessions.",
        "Developed dynamic <strong>Angular client interfaces with WebSockets</strong> integration to facilitate low-latency live bid streaming, instant price updates, and real-time outbid notifications.",
        "Optimized <strong>PostgreSQL database performance</strong> by redesigning relational schemas, indexing high-query columns, and optimizing complex queries, significantly reducing latency under high bidding concurrency.",
        "Collaborated on <strong>RESTful API development and backend services</strong> using Node.js, implementing secure authentication, data validation, and transactional integrity.",
        "Assisted in deploying and managing cloud applications across <strong>AWS infrastructure (EC2, S3, ELB)</strong>, integrating CI/CD pipelines for automated and reliable releases."
      ],
      techStack: "Angular, TypeScript, Node.js, Express, PostgreSQL, WebSockets, AWS (EC2, S3), Git"
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}
