import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-architecture',
  imports: [CommonModule],
  templateUrl: './architecture.component.html',
  styleUrl: './architecture.component.scss'
})
export class ArchitectureComponent implements OnInit {
  architectures = [
    {
      title: "Asynchronous Systems",
      icon: "fas fa-network-wired",
      description: "Designing message producer-consumer architecture using RabbitMQ & Kafka to decouple CPU-bound background processes from client HTTP cycles."
    },
    {
      title: "Schema Indexing & Concurrency",
      icon: "fas fa-database",
      description: "Optimizing relational databases (PostgreSQL/MySQL) with indexing strategies, transaction isolation levels, and query optimization."
    }
  ];

  educations = [
    {
      degree: "Master of Computer Applications (MCA)",
      institute: "Netaji Subhash Engineering College (2021 – 2023)",
      cgpa: "CGPA: 9.17 / 10"
    },
    {
      degree: "Bachelor of Computer Applications (BCA)",
      institute: "Kotibarsha Institute of Tech & Mgmt (2018 – 2021)",
      cgpa: "CGPA: 8.54 / 10"
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
