import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {

  rotatingWords = [
    "Distributed Backend Systems.",
    "Scalable Financial Pipelines.",
    "High-Performance Angular Apps.",
    "Event-Driven Microservices."
  ];

  typewriterText = '';
  private phraseIdx = 0;
  private charIdx = 0;
  private isDeleting = false;
  private typingTimeout: any;

  terminalLogs: Array<{ time: string, tag: string, type: string, message: string }> = [];
  private logTemplates = [
    { tag: "SYSTEM", type: "system", message: "Initializing JIT SNA-Sparsh allocation engine..." },
    { tag: "SUCCESS", type: "success", message: "Fund Transfer Order batch #9421 dispatched to state portal." },
    { tag: "QUEUE", type: "queue", message: "RabbitMQ message broker acknowledged 142 message events." },
    { tag: "DB", type: "db", message: "PostgreSQL: index scan on tbl_bids optimized in 2.8ms." },
    { tag: "KAFKA", type: "kafka", message: "Kafka consumer stream active on topic 'inventory-updates'." },
    { tag: "AWS", type: "aws", message: "ELB load balancer health-check: OK. Latency 14ms." },
    { tag: "SECURITY", type: "security", message: "RBAC check: Authorized user access token verified via JWT." },
    { tag: "SUCCESS", type: "success", message: "Socket.IO: Bid session #541 synced real-time events." }
  ];
  private logInterval: any;

  stats = [
    { number: "3+ Yrs", label: "Full Stack Experience" },
    { number: "9.17", label: "MCA CGPA (Top Tier)" },
    { number: "Real-time", label: "Fund & Bidding Systems" },
    { number: "AWS & Docker", label: "CI/CD & Containerized" }
  ];

  techIcons = [
    { icon: "fab fa-angular", color: "#ff6b6b", position: { top: "10%", right: "6%" }, delay: "0s" },
    { icon: "fab fa-js-square", color: "#ffcf5f", position: { top: "44%", left: "-2%" }, delay: "0.8s" },
    { icon: "fab fa-node-js", color: "#7af0b8", position: { bottom: "18%", right: "2%" }, delay: "1.6s" },
    { icon: "fas fa-database", color: "#6ee7f9", position: { bottom: "4%", left: "12%" }, delay: "2.4s" },
  ];

  ngOnInit() {
    this.typeEffect();
    this.initTerminalLogs();
  }

  ngOnDestroy() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    if (this.logInterval) {
      clearInterval(this.logInterval);
    }
  }

  private initTerminalLogs() {
    // Generate initial logs
    for (let i = 0; i < 4; i++) {
      this.terminalLogs.push(this.createLog(this.logTemplates[i]));
    }

    // Interval to add new logs
    let templateIdx = 4;
    this.logInterval = setInterval(() => {
      if (this.terminalLogs.length >= 4) {
        this.terminalLogs.shift();
      }
      const tpl = this.logTemplates[templateIdx];
      this.terminalLogs.push(this.createLog(tpl));
      templateIdx = (templateIdx + 1) % this.logTemplates.length;
    }, 2800);
  }

  private createLog(tpl: { tag: string, type: string, message: string }) {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    return {
      time: timeStr,
      tag: `[${tpl.tag}]`,
      type: tpl.type,
      message: tpl.message
    };
  }

  private typeEffect() {
    const current = this.rotatingWords[this.phraseIdx];
    this.typewriterText = this.isDeleting
      ? current.substring(0, this.charIdx - 1)
      : current.substring(0, this.charIdx + 1);

    this.charIdx = this.isDeleting ? this.charIdx - 1 : this.charIdx + 1;

    let delay = this.isDeleting ? 40 : 80;

    if (!this.isDeleting && this.charIdx === current.length) {
      delay = 1600; // Pause at the end of word
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIdx === 0) {
      this.isDeleting = false;
      this.phraseIdx = (this.phraseIdx + 1) % this.rotatingWords.length;
      delay = 200; // Brief pause before starting next word
    }

    this.typingTimeout = setTimeout(() => this.typeEffect(), delay);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 88;
      window.scrollTo({
        top: element.offsetTop - headerHeight,
        behavior: 'smooth'
      });
    }
  }
}
