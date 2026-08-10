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
      company: "SISL Infotech Pvt Ltd (NIC)",
      period: "Aug 2024 — Present | Kolkata, India",
      points: [
        "<strong>JIT SNA-Sparsh Engine:</strong> Owned backend architecture and development of a real-time fund management system enabling seamless fund allocation between Central and State government entities.",
        "<strong>Workflow Engine & Fault Tolerance:</strong> Engineered a resilient Fund Transfer Order workflow engine featuring automated retry logic, exponential backoff, and partial-success handling under peak transactions.",
        "<strong>Asynchronous Pipelines:</strong> Integrated Node.js with RabbitMQ message queues to process asynchronous tasks, improving throughput by decoupling heavy financial computations.",
        "<strong>Enterprise Security:</strong> Designed REST APIs with multi-step validation, Role-Based Access Control (RBAC), and immutable audit logging.",
        "<strong>Containerization:</strong> Containerized core microservices using Docker to streamline dev-to-prod environment setups aligned with CI/CD practices."
      ]
    },
    {
      role: "Junior Software Developer",
      company: "Phloxblog",
      period: "Aug 2023 — Aug 2024 | Kolkata, India",
      points: [
        "<strong>Real-time E-Auction Platform:</strong> Developed an end-to-end e-auction web platform managing asset lifecycles, user bidding, and active live sessions.",
        "<strong>Angular Frontend & WebSockets:</strong> Built responsive Angular client interfaces with WebSockets integration for instantaneous live bid streaming without manual refreshes.",
        "<strong>Database Optimization:</strong> Redesigned PostgreSQL schemas, added compound indexes, and tuned queries to prevent bottlenecks during high concurrency.",
        "<strong>AWS Cloud Infrastructure:</strong> Deployed applications to AWS EC2 and S3, configuring Elastic Load Balancing (ELB) to maintain application availability."
      ]
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
