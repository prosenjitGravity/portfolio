import { AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TopbarComponent } from '../topbar/topbar.component';
import { CommonModule } from '@angular/common';
import { HeroComponent } from "../hero/hero.component";
import { AboutComponent } from "../about/about.component";
import { ServicesComponent } from "../services/services.component";
import { ExperienceComponent } from "../experience/experience.component";
import { PortfolioComponent } from "../portfolio/portfolio.component";
import { ArchitectureComponent } from "../architecture/architecture.component";
import { ContactComponent } from "../contact/contact.component";
import { FooterComponent } from "../footer/footer.component";
import { LoggerService } from '../../services/logger.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LinkedinActivity, LinkedinEducation, LinkedinExperience, LinkedinProfile, LinkedinProfileService } from '../../services/linkedin-profile.service';
import { environment } from '../../../environment/environment';

interface WindowState {
  id: string;
  title: string;
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  width?: string;
  height?: string;
  zIndex: number;
  minimizing?: boolean;
  restoring?: boolean;
}

interface FileSystemItem {
  name: string;
  type: 'file' | 'folder' | 'app';
  icon: string;
  colorClass?: string;
  fileKey?: string;
  windowId?: string;
  targetPath?: string;
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    TopbarComponent,
    HeroComponent,
    AboutComponent,
    ServicesComponent,
    ExperienceComponent,
    PortfolioComponent,
    ArchitectureComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('contentContainer') contentContainer!: ElementRef;

  private logger = inject(LoggerService);
  private http = inject(HttpClient);
  private linkedinService = inject(LinkedinProfileService);

  // GitHub live data states
  githubProfile: any = null;
  githubRepos: any[] = [];
  githubLoading = false;
  githubError = false;
  githubUsingFallback = false;

  // LinkedIn dashboard states
  linkedinProfile: LinkedinProfile | null = null;
  linkedinExperience: LinkedinExperience[] = [];
  linkedinEducation: LinkedinEducation[] = [];
  linkedinActivities: LinkedinActivity[] = [];
  linkedinLoading = false;
  linkedinError = false;

  // Original Layout States
  activeSectionId: string = 'home';
  sections: string[] = ['home', 'about', 'services', 'experience', 'projects', 'contact'];
  scrollPosition: number = 0;
  loggingEnabled = true;

  // macOS Layout States
  // Start with the interactive macOS portfolio; visitors can switch to the classic layout.
  classicMode: boolean = false;
  currentTime: string = '';
  currentDayName: string = '';
  currentDayNum: string = '';
  maxZIndex: number = 100;

  // Control Center States
  showControlCenter = false;
  wifiActive = true;
  bluetoothActive = true;
  airdropActive = false;
  dndActive = false;
  stageManagerActive = false;
  brightness = 100;
  volume = 50;
  isPlayingMusic = false;

  // Photo Booth States
  photoBoothStream: MediaStream | null = null;
  photoBoothFilter = 'none';
  photoBoothCountdown: number | null = null;
  photoBoothPhotos: string[] = [];
  photoBoothFlash = false;

  // Notification States
  showNotificationPanel = false;
  notifications = [
    {
      id: 1,
      appName: "GitHub",
      icon: "fab fa-github",
      time: "5m ago",
      title: "New Star Received!",
      desc: "User GeminiCoder starred your repository 'portfolio'."
    },
    {
      id: 2,
      appName: "System",
      icon: "fas fa-laptop-code",
      time: "20m ago",
      title: "Layout Switched",
      desc: "Welcome to the macOS Desktop layout. Explore drag-and-drop windows and the interactive terminal."
    },
    {
      id: 3,
      appName: "Calendar",
      icon: "far fa-calendar-alt",
      time: "1h ago",
      title: "Portfolio Review",
      desc: "Scheduled check-in at 2:30 PM."
    }
  ];

  // Window list configuration
  windows: { [key: string]: WindowState } = {
    about: { id: 'about', title: 'About Me', open: true, minimized: false, maximized: false, x: 200, y: 100, zIndex: 10 },
    projects: { id: 'projects', title: 'Projects Explorer', open: false, minimized: false, maximized: false, x: 120, y: 80, zIndex: 1 },
    skills: { id: 'skills', title: 'Skills & Tech Stack', open: false, minimized: false, maximized: false, x: 150, y: 120, zIndex: 1 },
    experience: { id: 'experience', title: 'Work Experience', open: false, minimized: false, maximized: false, x: 180, y: 140, zIndex: 1 },
    education: { id: 'education', title: 'Education & Systems', open: false, minimized: false, maximized: false, x: 220, y: 160, zIndex: 1 },
    terminal: { id: 'terminal', title: 'prosenjit@system:~', open: false, minimized: false, maximized: false, x: 250, y: 200, zIndex: 1 },
    contact: { id: 'contact', title: 'Contact / Mail', open: false, minimized: false, maximized: false, x: 280, y: 240, zIndex: 1 },
    google: { id: 'google', title: 'Google Chrome', open: false, minimized: false, maximized: false, x: 140, y: 70, zIndex: 1 },
    textedit: { id: 'textedit', title: 'TextEdit', open: false, minimized: false, maximized: false, x: 300, y: 150, zIndex: 1 },
    finder: { id: 'finder', title: 'Finder', open: false, minimized: false, maximized: false, x: 100, y: 120, zIndex: 1 },
    resumeapp: { id: 'resumeapp', title: 'Preview — Resume', open: false, minimized: false, maximized: false, x: 180, y: 80, zIndex: 1 },
    github: { id: 'github', title: 'Safari — GitHub', open: false, minimized: false, maximized: false, x: 160, y: 90, zIndex: 1 },
    linkedin: { id: 'linkedin', title: 'Safari — LinkedIn', open: false, minimized: false, maximized: false, x: 210, y: 110, zIndex: 1 },
    photobooth: { id: 'photobooth', title: 'Photo Booth', open: false, minimized: false, maximized: false, x: 250, y: 120, zIndex: 1 },
    welcome: { id: 'welcome', title: 'Welcome', open: true, minimized: false, maximized: false, x: 80, y: 120, zIndex: 2 }
  };

  // Draggable Desktop Icons Configuration
  desktopIcons = [
    { id: 'finder', label: 'Macintosh HD', iconClass: 'folder-icon', icon: 'fas fa-hdd', windowId: 'finder', x: 0, y: 0, fileKey: '' },
    { id: 'projects', label: 'Projects', iconClass: 'folder-icon', icon: 'fas fa-folder', windowId: 'projects', x: 0, y: 0, fileKey: '' },
    { id: 'skills', label: 'Skills', iconClass: 'folder-icon', icon: 'fas fa-folder', windowId: 'skills', x: 0, y: 0, fileKey: '' },
    { id: 'experience', label: 'Experience', iconClass: 'folder-icon experience-icon', icon: 'fas fa-folder', windowId: 'experience', x: 0, y: 0, fileKey: '' },
    { id: 'education', label: 'Certificates', iconClass: 'folder-icon', icon: 'fas fa-folder', windowId: 'education', x: 0, y: 0, fileKey: '' },
    { id: 'resume', label: 'Resume.pdf', iconClass: 'pdf-icon', icon: 'fas fa-file-pdf', windowId: 'resumeapp', x: 0, y: 0, fileKey: '' },
    { id: 'github', label: 'GitHub Repos', iconClass: 'github-icon-item', icon: 'fab fa-github', windowId: 'github', x: 0, y: 0, fileKey: '' },
    { id: 'linkedin', label: 'LinkedIn', iconClass: 'linkedin-icon-item', icon: 'fab fa-linkedin', windowId: 'linkedin', x: 0, y: 0, fileKey: '' },
    { id: 'contact', label: 'Contact.mail', iconClass: 'contact-icon-item', icon: 'fas fa-envelope', windowId: 'contact', x: 0, y: 0, fileKey: '' },
    { id: 'photobooth', label: 'Photo Booth', iconClass: 'photobooth-icon-item', icon: 'fas fa-camera', windowId: 'photobooth', x: 0, y: 0, fileKey: '' }
  ];

  // macOS Dock configuration
  dockItems = [
    { id: 'finder', label: 'Finder', icon: 'fas fa-smile', type: 'app', windowId: 'finder', fileKey: '' },
    { id: 'about', label: 'About Me', icon: 'fas fa-user-circle', type: 'app', windowId: 'about', fileKey: '' },
    { id: 'google', label: 'Google Search', icon: 'fab fa-google', type: 'app', windowId: 'google', fileKey: '' },
    { id: 'github', label: 'GitHub', icon: 'fab fa-github', type: 'app', windowId: 'github', fileKey: '' },
    { id: 'linkedin', label: 'LinkedIn', icon: 'fab fa-linkedin', type: 'app', windowId: 'linkedin', fileKey: '' },
    { id: 'contact', label: 'Mail / Contact', icon: 'fas fa-envelope', type: 'app', windowId: 'contact', fileKey: '' },
    { id: 'projects', label: 'Projects', icon: 'fas fa-folder', type: 'app', windowId: 'projects', fileKey: '' },
    { id: 'skills', label: 'Skills', icon: 'fas fa-brain', type: 'app', windowId: 'skills', fileKey: '' },
    { id: 'experience', label: 'Experience', icon: 'fas fa-briefcase', type: 'app', windowId: 'experience', fileKey: '' },
    { id: 'education', label: 'Certificates', icon: 'fas fa-graduation-cap', type: 'app', windowId: 'education', fileKey: '' },
    { id: 'terminal', label: 'Developer Log', icon: 'fas fa-terminal', type: 'app', windowId: 'terminal', fileKey: '' },
    // { id: 'textedit', label: 'TextEdit', icon: 'far fa-file-alt', type: 'app', windowId: 'textedit', fileKey: '' },
    // { id: 'resumeapp', label: 'Resume Viewer', icon: 'fas fa-file-pdf', type: 'app', windowId: 'resumeapp', fileKey: '' },
    // { id: 'photobooth', label: 'Photo Booth', icon: 'fas fa-camera', type: 'app', windowId: 'photobooth', fileKey: '' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog', type: 'settings', windowId: '', fileKey: '' }
  ];

  // Finder / Explorer States
  currentPath = '/Desktop';
  finderHistory = ['/Desktop'];
  finderHistoryIndex = 0;
  finderSearchQuery = '';

  // Google Search States
  searchQuery = '';
  lastSearchedQuery = '';

  // Dragging States for Windows
  isDragging = false;
  draggedWindowId: string | null = null;
  dragStartX = 0;
  dragStartY = 0;
  windowStartX = 0;
  windowStartY = 0;

  // Dragging States for Desktop Icons
  isDraggingIcon = false;
  draggedIconId: string | null = null;
  iconDragStartX = 0;
  iconDragStartY = 0;
  iconStartX = 0;
  iconStartY = 0;
  iconDragMoved = false;

  // Coordinates tracking to support drop inside dock
  lastMouseX = 0;
  lastMouseY = 0;
  draggedDockIndex: number | null = null;

  // Interactive Terminal States
  @ViewChild('terminalBody') terminalBody!: ElementRef;
  @ViewChild('terminalInputField') terminalInputField!: ElementRef;

  texteditTitle = 'TextEdit — welcome.txt';
  texteditContent = '';

  terminalCommand = '';
  terminalTheme = 'theme-classic';
  terminalHistory: Array<{ text: string, type: 'input' | 'output' | 'error' | 'success' | 'ascii' }> = [];
  commandHistory: string[] = [];
  commandHistoryIndex = -1;

  private logTemplates = [
    { tag: "SYSTEM", type: "system", message: "Initializing macOS Desktop environment..." },
    { tag: "LOAD", type: "success", message: "Fetched profile details from local database." },
    { tag: "PROJECTS", type: "queue", message: "Portfolios components registered in window manager." },
    { tag: "DOCK", type: "db", message: "macOS Dock magnification physics engine mounted." },
    { tag: "SUCCESS", type: "success", message: "All system services operational. Desktop loaded." }
  ];

  virtualFiles: { [key: string]: { title: string, content: string } } = {
    welcome: {
      title: 'Welcome.txt',
      content: `==================================================
👋 WELCOME TO MY MAC OS PORTFOLIO DESKTOP!
==================================================

Here you can explore my background, projects, skills, and experience as if you are browsing on a real macOS computer.

Quick Tips:
- Drag and drop windows to reposition them.
- Minimize, maximize, or close windows using the traffic light controls in the top left.
- Use the macOS Dock at the bottom to open applications.
- Double-click desktop file icons (like this one!) to read them.
- Open the "Terminal" from the Dock to run interactive CLI commands! Try typing 'help' or 'neofetch' in the terminal.

Have fun exploring! 
- Prosenjit Paul`
    },
    resume: {
      title: 'Resume.md',
      content: `# PROSENJIT PAUL
## Full Stack Developer | Kolkata, India
📧 paul.prosenjitbit@gmail.com | 🔗 linkedin.com/in/prosenjit-paul-0a82b6239 | 💻 github.com/prosenjitGravity

---

### PROFILE SUMMARY
Highly motivated and results-driven Software Developer with experience in designing, building, and optimizing scalable web applications. Skilled in backend architecture (Node.js, Express, PostgreSQL, RabbitMQ), frontend development (Angular, TypeScript), and cloud deployment. Passionate about engineering efficient, fault-tolerant software systems and delivering premium user experiences.

---

### PROFESSIONAL EXPERIENCE

#### 1. Software Developer | SISL Infotech Pvt. Ltd. (NIC)
*Aug 2024 — Present | Kolkata, India*
- Contributing to a **secure government financial management platform**, building high-reliability solutions for critical financial operations and digital governance workflows.
- Engineered **multi-tier scheme fund transfer mechanisms**, orchestrating automated, validated disbursements from **State level down to District, Block, and Village levels** based on scheme rules.
- Architected granular **user mapping and administrative hierarchy models**, enforcing strict multi-level RBAC, verification gates, and audit trails.
- Developed and enhanced high-throughput **RESTful APIs using .NET Core** and responsive **Angular** modules with a focus on scalability and maintainability.
- Implemented **RabbitMQ-based asynchronous message processing** to decouple heavy financial workflows and ensure automated retry mechanisms.
- Integrated core applications with **authorized government portals and external APIs** for secure, encrypted data exchange.
- Strengthened system security through **RBAC, multi-factor authorization, input validation, and tamper-evident audit logs**.
- **Tech Stack:** .NET Core, Angular, RabbitMQ, PostgreSQL, REST APIs, Microservices

#### 2. Junior Software Developer | Phloxblog
*Aug 2023 — Aug 2024 | Kolkata, India*
- Engineered core modules for a **real-time e-auction platform**, managing live auction sessions, asset catalogs, and participant bidding lifecycles.
- Developed dynamic **Angular client interfaces with WebSockets** for low-latency live bid streaming, instant outbid alerts, and seamless UI state updates.
- Optimized **PostgreSQL database performance** through relational schema redesign, strategic compound indexing, and query optimization, reducing latency spikes.
- Collaborated on backend REST APIs with **Node.js / Express**, implementing secure JWT authentication, sanitization, and transaction management.
- Assisted in cloud deployments and microservice monitoring on **AWS (EC2, S3, ELB)** with automated CI/CD workflows.
- **Tech Stack:** Angular, TypeScript, Node.js, Express, PostgreSQL, WebSockets, AWS (EC2, S3), Git

---

### EDUCATION
- **Master of Computer Applications (MCA)**
- **B.Tech in Computer Science & Engineering (CSE)**

---

### SKILLS & TECH STACK
  - **Languages:** .NET Core, Java, JavaScript, TypeScript, HTML/CSS, SQL
  - **Backend:** .NET Core, Node.js, Express, Spring Boot, RabbitMQ, Kafka, WebSockets, REST APIs
  - **Frontend:** Angular, HTML5, CSS3, SCSS, Vanilla JS
  - **Databases:** PostgreSQL, MongoDB, Redis
  - **DevOps & Cloud:** Docker, AWS (EC2, S3, ELB), CI/CD
  - **Other:** Git, Data Structures & Algorithms, System Design`
    },
    secret: {
      title: 'Secret.txt',
      content: `🕵️‍♂️ CONGRATULATIONS! YOU FOUND THE SECRET FILE!

Here is an Easter Egg just for you:

Did you know this entire portfolio supports interactive Terminal commands?
Open the Terminal window and try these secret/hidden commands:
1. "neofetch" - displays a retro system diagnostic screen.
2. "sudo rm -rf /" - see what happens when you try to wipe the system.
3. "theme matrix" or "theme dracula" - changes the terminal skin!
4. "matrix" - starts a matrix rainfall background simulation!
5. "date" - prints the current timestamp.

Thanks for visiting my portfolio!`
    },
    experience_summary: {
      title: 'Work_Experience.txt',
      content: `==================================================
💼 WORK EXPERIENCE SUMMARY - PROSENJIT PAUL
==================================================

1. SOFTWARE DEVELOPER | SISL Infotech Pvt. Ltd. (NIC)
   Aug 2024 — Present | Kolkata, India
   - Government financial management platform (critical financial operations & digital workflows)
   - Multi-tier scheme fund transfer: State -> District -> Block -> Village level execution
   - Granular administrative user mapping & hierarchy models with strict multi-level RBAC
   - RESTful APIs (.NET Core), modular Angular interfaces, RabbitMQ async message queues
   - External government portal integrations, audit mechanisms & cryptographic validation
   - Tech Stack: .NET Core, Angular, RabbitMQ, PostgreSQL, REST APIs, Microservices

2. JUNIOR SOFTWARE DEVELOPER | Phloxblog
   Aug 2023 — Aug 2024 | Kolkata, India
   - Real-time E-Auction Platform managing live auction rooms & bidding lifecycles
   - Angular client interfaces with WebSockets for sub-second live bid streaming
   - PostgreSQL schema design, indexing strategies & database query tuning
   - Node.js / Express REST APIs with JWT authentication & transaction pipelines
   - AWS (EC2, S3, ELB) cloud deployments & CI/CD release management
   - Tech Stack: Angular, TypeScript, Node.js, Express, PostgreSQL, WebSockets, AWS`
    },
    skills_summary: {
      title: 'Skills_Inventory.txt',
      content: `==================================================
🛠️ TECHNICAL SKILLS & STACK
==================================================

- LANGUAGES: .NET Core, Java, JavaScript (ES6+), TypeScript, SQL, HTML5, CSS3, SCSS
- BACKEND: Node.js, Express, Spring Boot, RabbitMQ, Kafka, WebSockets, RESTful APIs
- FRONTEND: Angular, RxJS, Template Driven & Reactive Forms
- DATABASES: PostgreSQL, MongoDB, Redis
- INFRASTRUCTURE: Docker, AWS (EC2, S3, ELB, CloudWatch), Linux, Git`
    },
    education_summary: {
      title: 'Education_Certificates.txt',
      content: `==================================================
🎓 EDUCATION & SYSTEMS DETAILS
==================================================

- MCA (Master of Computer Applications)
  Specialization: Software Engineering, DBMS, Distributed Systems

- B.Tech in Computer Science & Engineering (CSE)
  Specialization: Algorithms, Operating Systems, Networking

- CERTIFICATIONS & HIGHLIGHTS:
  - Docker Certified Development patterns
  - AWS Infrastructure & Cloud Architecting courses
  - LeetCode Active solver (leetcode.com/u/prosenjitGravity)`
    }
  };

  virtualDirectory: { [path: string]: FileSystemItem[] } = {
    '/': [
      { name: 'Desktop', type: 'folder', icon: 'fas fa-desktop', targetPath: '/Desktop' },
      { name: 'Documents', type: 'folder', icon: 'fas fa-folder', targetPath: '/Documents' },
      { name: 'Applications', type: 'folder', icon: 'fas fa-laptop-code', targetPath: '/Applications' }
    ],
    '/Desktop': [
      { name: 'Welcome.txt', type: 'file', icon: 'far fa-file-alt', colorClass: 'txt-icon-item', fileKey: 'welcome' },
      { name: 'Resume.md', type: 'file', icon: 'fab fa-markdown', colorClass: 'txt-icon-item', fileKey: 'resume' },
      { name: 'Secret.txt', type: 'file', icon: 'far fa-file-alt', colorClass: 'txt-icon-item', fileKey: 'secret' },
      { name: 'Resume.pdf', type: 'file', icon: 'fas fa-file-pdf', colorClass: 'pdf-icon', fileKey: 'resume_pdf' }
    ],
    '/Documents': [
      { name: 'Work_Experience.txt', type: 'file', icon: 'far fa-file-alt', colorClass: 'txt-icon-item', fileKey: 'experience_summary' },
      { name: 'Skills_Inventory.txt', type: 'file', icon: 'far fa-file-alt', colorClass: 'txt-icon-item', fileKey: 'skills_summary' },
      { name: 'Education_Certificates.txt', type: 'file', icon: 'far fa-file-alt', colorClass: 'txt-icon-item', fileKey: 'education_summary' }
    ],
    '/Applications': [
      { name: 'About Me.app', type: 'app', icon: 'fas fa-smile', colorClass: 'finder-app-icon', windowId: 'about' },
      { name: 'Projects Explorer.app', type: 'app', icon: 'fas fa-folder', colorClass: 'finder-app-icon', windowId: 'projects' },
      { name: 'Skills & Tech.app', type: 'app', icon: 'fas fa-brain', colorClass: 'finder-app-icon', windowId: 'skills' },
      { name: 'Work Experience.app', type: 'app', icon: 'fas fa-briefcase', colorClass: 'finder-app-icon', windowId: 'experience' },
      { name: 'Terminal.app', type: 'app', icon: 'fas fa-terminal', colorClass: 'finder-app-icon', windowId: 'terminal' },
      { name: 'Google Chrome.app', type: 'app', icon: 'fab fa-google', colorClass: 'finder-app-icon', windowId: 'google' },
      { name: 'Mail.app', type: 'app', icon: 'fas fa-envelope', colorClass: 'finder-app-icon', windowId: 'contact' }
    ]
  };

  constructor() { }

  // Widgets States
  githubContributions: number[] = [];
  calendarDays: number[] = [];
  currentMonthYear: string = '';

  // Client IP & Device Telemetry
  clientIp: string = '127.0.0.1 (en0)';

  ngOnInit(): void {
    this.logger.info("UserComponent initialized", undefined, "UserComponent");
    this.loggingEnabled = this.logger.getConfig().enabled;

    // Fetch Client IP for Photo Booth Telemetry
    this.fetchClientIp();

    // Initialize date time and set interval updates
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 10000);

    // Initial responsive window positioning
    this.adjustWindowSizes();
    this.initIconPositions();

    // Start terminal logs simulation
    this.initTerminal();

    // Start widgets simulation
    this.initCalendarGrid();
    this.initGithubContributions();
  }

  fetchClientIp() {
    const ipEndpoint = environment.api?.ipGeoApiUrl || 'https://api.ipify.org?format=json';
    fetch(ipEndpoint)
      .then(res => res.json())
      .then(data => {
        if (data && data.ip) {
          this.clientIp = data.ip;
        }
      })
      .catch(() => {
        this.clientIp = '192.168.1.108';
      });
  }

  initGithubContributions() {
    this.githubContributions = [];
    // 7 rows * 16 columns = 112 cells
    for (let i = 0; i < 112; i++) {
      const rand = Math.random();
      if (rand < 0.45) {
        this.githubContributions.push(0);
      } else if (rand < 0.75) {
        this.githubContributions.push(1);
      } else if (rand < 0.92) {
        this.githubContributions.push(2);
      } else {
        this.githubContributions.push(3);
      }
    }
  }

  initCalendarGrid() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.currentMonthYear = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(0);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    this.calendarDays = days;
  }

  initTerminal() {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    this.terminalHistory.push({
      text: `Last login: ${now.toDateString()} ${timeStr} on ttys001`,
      type: 'output'
    });

    this.logTemplates.forEach(t => {
      this.terminalHistory.push({
        text: `[${t.tag}] ${t.message}`,
        type: t.type === 'success' ? 'success' : (t.type === 'system' ? 'ascii' : 'output')
      });
    });

    this.terminalHistory.push({
      text: `\nWelcome to Prosenjit's interactive shell. Type 'help' to list available commands.\n`,
      type: 'ascii'
    });
  }

  focusTerminalInput() {
    if (this.terminalInputField) {
      this.terminalInputField.nativeElement.focus();
    }
  }

  onTerminalSubmit() {
    const cmd = this.terminalCommand.trim();
    if (!cmd) return;

    this.terminalHistory.push({ text: cmd, type: 'input' });
    this.commandHistory.push(cmd);
    this.commandHistoryIndex = this.commandHistory.length;
    this.terminalCommand = '';

    this.executeCommand(cmd);
    this.scrollToTerminalBottom();
  }

  onTerminalPrevCommand(event: Event) {
    event.preventDefault();
    if (this.commandHistory.length === 0) return;
    if (this.commandHistoryIndex > 0) {
      this.commandHistoryIndex--;
      this.terminalCommand = this.commandHistory[this.commandHistoryIndex];
    }
  }

  onTerminalNextCommand(event: Event) {
    event.preventDefault();
    if (this.commandHistoryIndex < this.commandHistory.length - 1) {
      this.commandHistoryIndex++;
      this.terminalCommand = this.commandHistory[this.commandHistoryIndex];
    } else {
      this.commandHistoryIndex = this.commandHistory.length;
      this.terminalCommand = '';
    }
  }

  scrollToTerminalBottom() {
    setTimeout(() => {
      if (this.terminalBody) {
        this.terminalBody.nativeElement.scrollTop = this.terminalBody.nativeElement.scrollHeight;
      }
    }, 10);
  }

  openFile(fileKey: string) {
    const file = this.virtualFiles[fileKey];
    if (file) {
      this.texteditTitle = `TextEdit — ${file.title}`;
      this.texteditContent = file.content;
      this.openWindow('textedit');
    }
  }

  executeCommand(cmdStr: string) {
    const parts = cmdStr.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (command) {
      case 'help':
      case '?':
        this.printHelp();
        break;
      case 'about':
        this.printAbout();
        break;
      case 'skills':
        this.printSkills();
        break;
      case 'experience':
        this.printExperience();
        break;
      case 'projects':
        this.printProjects();
        break;
      case 'contact':
        this.printContact();
        break;
      case 'ls':
        this.printLs();
        break;
      case 'cat':
        this.printCat(args);
        break;
      case 'open':
        this.printOpen(args);
        break;
      case 'neofetch':
      case 'sysinfo':
        this.printNeofetch();
        break;
      case 'clear':
      case 'cls':
        this.terminalHistory = [];
        break;
      case 'theme':
        this.setTerminalTheme(args);
        break;
      case 'sudo':
        this.terminalHistory.push({
          text: `sudo: permission denied. Nice try! Prosenjit's firewall is watching you. 😉`,
          type: 'error'
        });
        break;
      case 'download-resume':
        this.downloadCV();
        this.terminalHistory.push({
          text: `Triggered download for Prosenjit_Resume_lts.pdf successfully.`,
          type: 'success'
        });
        break;
      case 'gui':
      case 'classic':
        this.toggleClassicMode();
        this.terminalHistory.push({
          text: `Toggling classic scrolling layout.`,
          type: 'success'
        });
        break;
      default:
        this.terminalHistory.push({
          text: `zsh: command not found: ${command}. Type 'help' to see available commands.`,
          type: 'error'
        });
    }
  }

  private printHelp() {
    const helpText = `Available Commands:
  help / ?            - Show this list of commands
  about               - Display professional profile
  skills              - List technical skills & tech stack
  experience          - Show work history details
  projects            - View showcase projects
  contact             - Show email & social links
  ls                  - List virtual files on Desktop
  cat [file]          - View contents of a file (e.g. cat Welcome.txt)
  open [app]          - Open a desktop application (e.g. open projects)
  neofetch / sysinfo  - Display system specifications
  clear / cls         - Clear terminal screen
  theme [style]       - Change theme (classic, matrix, dracula, retro)
  sudo [command]      - Run command as superuser (restricted)
  download-resume     - Trigger PDF Resume download
  gui                 - Toggle classic portfolio layout`;
    this.terminalHistory.push({ text: helpText, type: 'output' });
  }

  private printAbout() {
    const text = `Prosenjit Paul - Full Stack Developer
Location: Kolkata, India
Bio: I build modern, responsive, and user-friendly web applications.
Specialization: Node.js, Express, Angular, Postgres, RabbitMQ, AWS.
Use 'open about' to open the GUI window.`;
    this.terminalHistory.push({ text, type: 'output' });
  }

  private printSkills() {
    const text = `Languages:   .NET Core, Java, JavaScript, TypeScript, HTML/CSS, SQL
Backend:     .NET Core, Node.js, Express, Spring Boot, RabbitMQ, Kafka, WebSockets, REST APIs
Frontend:    Angular, HTML5, CSS3, SCSS
Databases:   PostgreSQL, MongoDB, Redis
DevOps:      Docker, AWS (EC2, S3, ELB), CI/CD`;
    this.terminalHistory.push({ text, type: 'output' });
  }

  private printExperience() {
    const text = `1. Software Developer @ SISL Infotech Pvt. Ltd. (NIC) [Aug 2024 - Present]
   - Government financial management platform & digital governance workflows.
   - Multi-tier scheme fund transfers (State -> District -> Block -> Village level).
   - User mapping & hierarchy models, strict RBAC, audit mechanisms.
   - RESTful APIs (.NET Core), Angular, RabbitMQ async processing queues.
   - Tech Stack: .NET Core, Angular, RabbitMQ, PostgreSQL, REST APIs
2. Junior Software Developer @ Phloxblog [Aug 2023 - Aug 2024]
   - Real-time E-Auction platform with WebSocket live bid streaming (Angular).
   - PostgreSQL schema optimization, indexing & high concurrency query tuning.
   - Node.js backend services, AWS (EC2/S3/ELB) cloud deployments.
   - Tech Stack: Angular, Node.js, Express, PostgreSQL, WebSockets, AWS`;
    this.terminalHistory.push({ text, type: 'output' });
  }

  private printProjects() {
    const text = `Major Projects:
  - SNA-Sparsh Engine (NIC)
  - Real-time E-Auction Web App
  - Developer Portfolio & macOS Desktop Simulator
Use 'open projects' to view the Projects Explorer GUI.`;
    this.terminalHistory.push({ text, type: 'output' });
  }

  private printContact() {
    const text = `Email:    paul.prosenjitgravity@gmail.com
LinkedIn: linkedin.com/in/prosenjit-paul-0a82b6239
GitHub:   github.com/prosenjitGravity`;
    this.terminalHistory.push({ text, type: 'output' });
  }

  private printLs() {
    const text = `Welcome.txt    Resume.md    Secret.txt    Resume.pdf`;
    this.terminalHistory.push({ text, type: 'success' });
  }

  private printCat(fileName: string) {
    if (!fileName) {
      this.terminalHistory.push({ text: `Usage: cat [filename]`, type: 'error' });
      return;
    }

    const key = fileName.toLowerCase().replace('.txt', '').replace('.md', '').trim();
    if (key === 'resume' || key === 'resume_txt') {
      this.terminalHistory.push({ text: this.virtualFiles['resume'].content, type: 'output' });
    } else if (key === 'welcome') {
      this.terminalHistory.push({ text: this.virtualFiles['welcome'].content, type: 'output' });
    } else if (key === 'secret') {
      this.terminalHistory.push({ text: this.virtualFiles['secret'].content, type: 'output' });
    } else if (key === 'resume.pdf') {
      this.terminalHistory.push({ text: `resume.pdf is a binary file. Type 'download-resume' or 'open resume' to download/view it.`, type: 'error' });
    } else {
      this.terminalHistory.push({ text: `cat: ${fileName}: No such file or directory`, type: 'error' });
    }
  }

  private printOpen(appName: string) {
    if (!appName) {
      this.terminalHistory.push({ text: `Usage: open [app_name | file_name]`, type: 'error' });
      return;
    }

    const name = appName.toLowerCase().trim();
    if (name === 'about' || name === 'about me') {
      this.openWindow('about');
      this.terminalHistory.push({ text: `Opening About Me...`, type: 'success' });
    } else if (name === 'projects' || name === 'portfolio') {
      this.openWindow('projects');
      this.terminalHistory.push({ text: `Opening Projects Explorer...`, type: 'success' });
    } else if (name === 'skills' || name === 'services') {
      this.openWindow('skills');
      this.terminalHistory.push({ text: `Opening Skills Explorer...`, type: 'success' });
    } else if (name === 'experience') {
      this.openWindow('experience');
      this.terminalHistory.push({ text: `Opening Work Experience...`, type: 'success' });
    } else if (name === 'education' || name === 'certificates') {
      this.openWindow('education');
      this.terminalHistory.push({ text: `Opening Certificates & Education...`, type: 'success' });
    } else if (name === 'contact' || name === 'mail') {
      this.openWindow('contact');
      this.terminalHistory.push({ text: `Opening Contact Form...`, type: 'success' });
    } else if (name === 'google' || name === 'browser') {
      this.openWindow('google');
      this.terminalHistory.push({ text: `Opening Google Search Chrome Window...`, type: 'success' });
    } else if (name === 'github') {
      this.openWindow('github');
      this.terminalHistory.push({ text: `Opening GitHub Repositories...`, type: 'success' });
    } else if (name === 'linkedin') {
      this.openWindow('linkedin');
      this.terminalHistory.push({ text: `Opening LinkedIn Profile...`, type: 'success' });
    } else if (name === 'welcome' || name === 'welcome.txt') {
      this.openFile('welcome');
      this.terminalHistory.push({ text: `Opening welcome.txt in TextEdit...`, type: 'success' });
    } else if (name === 'resume.md') {
      this.openFile('resume');
      this.terminalHistory.push({ text: `Opening resume.md in TextEdit...`, type: 'success' });
    } else if (name === 'secret' || name === 'secret.txt') {
      this.openFile('secret');
      this.terminalHistory.push({ text: `Opening secret.txt in TextEdit...`, type: 'success' });
    } else if (name === 'resume' || name === 'resume.pdf') {
      this.openWindow('resumeapp');
      this.terminalHistory.push({ text: `Opening Resume Viewer...`, type: 'success' });
    } else {
      this.terminalHistory.push({ text: `open: ${appName}: App or file not found.`, type: 'error' });
    }
  }

  private printNeofetch() {
    const text = `                .88888888:.            guest@prosenjit-desktop
              .88888888.88888.         -----------------------
             .8888888888888888.        OS: macOS Sequoia 15.0 (Virtual)
            .888888888888888888        Kernel: Antigravity-v3.5.0
            88888888888888888888       Uptime: 2 hours, 14 mins
           :88888888888888888888.      Shell: zsh (interactive)
           .88888888888888888888.      Resolution: 1920x1080
           .88888888888888888888       DE: Aqua (Glassmorphic)
           88888888888888888888        WM: Quartz Window Manager
            888888888888888888         CPU: Apple M3 Max (8 Core)
            .8888888888888888          GPU: Apple M3 Integrated GPU
             .88888888.88888.          Memory: 32 GB LPDDR5
               ..::8888::..            Host: Prosenjit's Portfolio Server`;
    this.terminalHistory.push({ text, type: 'ascii' });
  }

  private setTerminalTheme(themeName: string) {
    const validThemes = ['classic', 'matrix', 'dracula', 'retro'];
    const name = themeName.trim().toLowerCase();
    if (!name) {
      this.terminalHistory.push({
        text: `Available themes: classic, matrix, dracula, retro. Usage: theme [style]`,
        type: 'output'
      });
      return;
    }

    if (validThemes.includes(name)) {
      this.terminalTheme = `theme-${name}`;
      this.terminalHistory.push({ text: `Terminal theme switched to '${name}'.`, type: 'success' });
    } else {
      this.terminalHistory.push({ text: `theme: '${themeName}' is not a valid theme style.`, type: 'error' });
    }
  }

  ngAfterViewInit(): void {
    this.updateActiveSectionId();
  }

  // DateTime updates for macOS topbar and calendar icon
  updateDateTime() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.currentDayName = days[now.getDay()].toUpperCase();
    this.currentDayNum = now.getDate().toString();

    const dayAbbrev = days[now.getDay()];
    const monthAbbrev = months[now.getMonth()];
    const dateNum = now.getDate();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    this.currentTime = `${dayAbbrev} ${dateNum} ${monthAbbrev} ${hours}:${minutes} ${ampm}`;
  }

  // Adjust window initial coordinates based on screen width
  adjustWindowSizes() {
    const width = window.innerWidth;
    if (width < 768) {
      // Mobile styling overrides coordinates to look clean
      Object.keys(this.windows).forEach(key => {
        this.windows[key].x = 10;
        this.windows[key].y = 60;
      });
    }
  }

  initIconPositions() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < 768) {
      // On mobile, arrange horizontally or wrap at the top
      let startX = 20;
      let startY = 40;
      this.desktopIcons.forEach((icon, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        icon.x = startX + (col * (width - 40) / 4);
        icon.y = startY + (row * 75);
      });
    } else {
      // On desktop, arrange in columns starting from the right side, wrapping to the left
      let startX = width - 110;
      let startY = 40;
      const columnGap = 95;
      const rowGap = 90;
      const maxRows = Math.max(1, Math.floor((height - 130) / rowGap));

      this.desktopIcons.forEach((icon, index) => {
        const col = Math.floor(index / maxRows);
        const row = index % maxRows;
        icon.x = startX - (col * columnGap);
        icon.y = startY + (row * rowGap);
      });
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustWindowSizes();
    this.initIconPositions();
  }

  toggleControlCenter(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.showControlCenter = !this.showControlCenter;
    if (this.showControlCenter) {
      this.showNotificationPanel = false;
    }
  }

  toggleNotificationPanel(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.showNotificationPanel = !this.showNotificationPanel;
    if (this.showNotificationPanel) {
      this.showControlCenter = false;
    }
  }

  clearNotifications() {
    this.notifications = [];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.control-center-panel') && !target.closest('.control-center-trigger')) {
      this.showControlCenter = false;
    }
    if (!target.closest('.notification-panel') && !target.closest('.notification-trigger')) {
      this.showNotificationPanel = false;
    }
  }

  private audioContext: AudioContext | null = null;
  playVolumeBeep() {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      osc.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioContext.currentTime);

      const volumeLevel = (this.volume / 100) * 0.15;
      gainNode.gain.setValueAtTime(volumeLevel, this.audioContext.currentTime);

      osc.start();
      osc.stop(this.audioContext.currentTime + 0.1);
    } catch (e) {
      console.warn('AudioContext not allowed or supported yet', e);
    }
  }

  // Photo Lightbox Preview State
  showPhotoPreview = false;

  openPhotoPreview(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.showPhotoPreview = true;
  }

  closePhotoPreview() {
    this.showPhotoPreview = false;
  }

  openDirectMessage() {
    if (this.classicMode) {
      this.scrollToSection('contact');
    } else {
      this.openWindow('contact');
    }
  }

  toggleMusicPlay() {
    this.isPlayingMusic = !this.isPlayingMusic;
  }

  // Windows Control Methods
  openWindow(id: string) {
    if (this.windows[id]) {
      if (id === 'github') {
        this.fetchGithubData();
      }
      if (id === 'linkedin') {
        this.fetchLinkedinData();
      }
      if (id === 'photobooth') {
        this.startPhotoBoothCamera();
      }
      if (this.windows[id].minimized) {
        this.windows[id].minimized = false;
        this.windows[id].open = true;
        this.windows[id].restoring = true;
        this.focusWindow(id);

        setTimeout(() => {
          this.windows[id].restoring = false;
        }, 350);
      } else {
        this.windows[id].open = true;
        this.windows[id].minimized = false;
        this.focusWindow(id);
      }
    }
  }

  closeWindow(id: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (this.windows[id]) {
      this.windows[id].open = false;
      if (id === 'photobooth') {
        this.stopPhotoBoothCamera();
      }
    }
  }

  minimizeWindow(id: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (window.innerWidth < 768) {
      return;
    }
    if (this.windows[id]) {
      this.windows[id].minimizing = true;
      if (id === 'photobooth') {
        this.stopPhotoBoothCamera();
      }
      setTimeout(() => {
        this.windows[id].minimized = true;
        this.windows[id].minimizing = false;
      }, 350);
    }
  }

  maximizeWindow(id: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (this.windows[id]) {
      this.windows[id].maximized = !this.windows[id].maximized;
      this.focusWindow(id);
    }
  }

  focusWindow(id: string) {
    this.maxZIndex += 1;
    if (this.windows[id]) {
      this.windows[id].zIndex = this.maxZIndex;
    }

    // Auto camera shutoff when changing window away from Photo Booth
    if (id !== 'photobooth' && this.photoBoothStream) {
      this.stopPhotoBoothCamera();
    } else if (id === 'photobooth' && this.windows['photobooth'].open && !this.windows['photobooth'].minimized && !this.photoBoothStream) {
      this.startPhotoBoothCamera();
    }
  }

  isWindowFocused(id: string): boolean {
    let highestZ = 0;
    let highestId = '';
    Object.keys(this.windows).forEach(key => {
      const w = this.windows[key];
      if (w.open && !w.minimized && w.zIndex > highestZ) {
        highestZ = w.zIndex;
        highestId = key;
      }
    });
    return highestId === id;
  }

  hasAnyOpenWindow(): boolean {
    return Object.keys(this.windows).some(key => key !== 'welcome' && this.windows[key].open && !this.windows[key].minimized);
  }

  getMinimizedWindows(): WindowState[] {
    return Object.values(this.windows).filter(window => window.open && window.minimized);
  }

  toggleClassicMode() {
    this.classicMode = !this.classicMode;
    if (this.photoBoothStream) {
      this.stopPhotoBoothCamera();
    }
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    if (document.hidden && this.photoBoothStream) {
      this.stopPhotoBoothCamera();
    }
  }

  @HostListener('window:blur')
  onWindowBlur() {
    if (this.photoBoothStream) {
      this.stopPhotoBoothCamera();
    }
  }

  ngOnDestroy(): void {
    if (this.photoBoothStream) {
      this.stopPhotoBoothCamera();
    }
  }

  // Handle Drag Events
  onMouseDown(event: MouseEvent, id: string) {
    // Only drag on titlebar (avoiding control buttons)
    const target = event.target as HTMLElement;
    if (target.closest('.mac-window-controls') || target.closest('.mac-window-btn')) {
      return;
    }

    if (this.windows[id].maximized) {
      return; // Disable drag if maximized
    }

    this.isDragging = true;
    this.draggedWindowId = id;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.windowStartX = this.windows[id].x;
    this.windowStartY = this.windows[id].y;

    this.focusWindow(id);
    event.preventDefault();
  }

  onIconMouseDown(event: MouseEvent, id: string) {
    this.isDraggingIcon = true;
    this.draggedIconId = id;
    this.iconDragStartX = event.clientX;
    this.iconDragStartY = event.clientY;
    const icon = this.desktopIcons.find(i => i.id === id);
    if (icon) {
      this.iconStartX = icon.x;
      this.iconStartY = icon.y;
    }
    this.iconDragMoved = false;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;

    if (this.isDragging && this.draggedWindowId) {
      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;

      let newX = this.windowStartX + deltaX;
      let newY = this.windowStartY + deltaY;

      const desktopHeight = window.innerHeight;
      const desktopWidth = window.innerWidth;

      if (newY < 28) newY = 28; // height of macOS top bar
      if (newY > desktopHeight - 120) newY = desktopHeight - 120;
      if (newX < -400) newX = -400;
      if (newX > desktopWidth - 100) newX = desktopWidth - 100;

      this.windows[this.draggedWindowId].x = newX;
      this.windows[this.draggedWindowId].y = newY;
    } else if (this.isDraggingIcon && this.draggedIconId) {
      const deltaX = event.clientX - this.iconDragStartX;
      const deltaY = event.clientY - this.iconDragStartY;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        this.iconDragMoved = true;
      }

      const icon = this.desktopIcons.find(i => i.id === this.draggedIconId);
      if (icon) {
        let newX = this.iconStartX + deltaX;
        let newY = this.iconStartY + deltaY;

        // Bounds checking
        const desktopWidth = window.innerWidth;
        const desktopHeight = window.innerHeight;
        if (newX < 10) newX = 10;
        if (newX > desktopWidth - 90) newX = desktopWidth - 90;
        if (newY < 40) newY = 40;
        if (newY > desktopHeight - 120) newY = desktopHeight - 120;

        icon.x = newX;
        icon.y = newY;
      }
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.isDragging = false;
    this.draggedWindowId = null;

    if (this.isDraggingIcon && this.draggedIconId) {
      const iconId = this.draggedIconId;
      const dockEl = document.querySelector('.mac-dock');
      if (dockEl) {
        const rect = dockEl.getBoundingClientRect();
        const x = this.lastMouseX;
        const y = this.lastMouseY;
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          this.pinIconToDock(iconId);
        }
      }
    }

    // Tiny timeout so click listener receives the status correctly before reset
    setTimeout(() => {
      this.isDraggingIcon = false;
      this.draggedIconId = null;
    }, 50);
  }

  // Handle Touch Drag Events for Mobile/Tablet Screens
  onTouchStart(event: TouchEvent, id: string) {
    const target = event.target as HTMLElement;
    if (target.closest('.mac-window-controls') || target.closest('.mac-window-btn')) {
      return;
    }

    if (this.windows[id].maximized) {
      return;
    }

    const touch = event.touches[0];
    this.isDragging = true;
    this.draggedWindowId = id;
    this.dragStartX = touch.clientX;
    this.dragStartY = touch.clientY;
    this.windowStartX = this.windows[id].x;
    this.windowStartY = this.windows[id].y;

    this.focusWindow(id);
  }

  onIconTouchStart(event: TouchEvent, id: string) {
    const touch = event.touches[0];
    this.isDraggingIcon = true;
    this.draggedIconId = id;
    this.iconDragStartX = touch.clientX;
    this.iconDragStartY = touch.clientY;
    const icon = this.desktopIcons.find(i => i.id === id);
    if (icon) {
      this.iconStartX = icon.x;
      this.iconStartY = icon.y;
    }
    this.iconDragMoved = false;
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    const touch = event.touches[0];
    this.lastMouseX = touch.clientX;
    this.lastMouseY = touch.clientY;

    if (this.isDragging && this.draggedWindowId) {
      const deltaX = touch.clientX - this.dragStartX;
      const deltaY = touch.clientY - this.dragStartY;

      let newX = this.windowStartX + deltaX;
      let newY = this.windowStartY + deltaY;

      const desktopHeight = window.innerHeight;
      const desktopWidth = window.innerWidth;

      if (newY < 28) newY = 28; // height of macOS top bar
      if (newY > desktopHeight - 120) newY = desktopHeight - 120;
      if (newX < -250) newX = -250;
      if (newX > desktopWidth - 50) newX = desktopWidth - 50;

      this.windows[this.draggedWindowId].x = newX;
      this.windows[this.draggedWindowId].y = newY;
    } else if (this.isDraggingIcon && this.draggedIconId) {
      const deltaX = touch.clientX - this.iconDragStartX;
      const deltaY = touch.clientY - this.iconDragStartY;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        this.iconDragMoved = true;
      }

      const icon = this.desktopIcons.find(i => i.id === this.draggedIconId);
      if (icon) {
        let newX = this.iconStartX + deltaX;
        let newY = this.iconStartY + deltaY;

        const desktopWidth = window.innerWidth;
        const desktopHeight = window.innerHeight;
        if (newX < 10) newX = 10;
        if (newX > desktopWidth - 90) newX = desktopWidth - 90;
        if (newY < 40) newY = 40;
        if (newY > desktopHeight - 120) newY = desktopHeight - 120;

        icon.x = newX;
        icon.y = newY;
      }
    }
  }

  @HostListener('window:touchend')
  onTouchEnd() {
    this.isDragging = false;
    this.draggedWindowId = null;

    if (this.isDraggingIcon && this.draggedIconId) {
      const iconId = this.draggedIconId;
      const dockEl = document.querySelector('.mac-dock');
      if (dockEl) {
        const rect = dockEl.getBoundingClientRect();
        const x = this.lastMouseX;
        const y = this.lastMouseY;
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          this.pinIconToDock(iconId);
        }
      }
    }

    setTimeout(() => {
      this.isDraggingIcon = false;
      this.draggedIconId = null;
    }, 50);
  }

  pinIconToDock(iconId: string) {
    const desktopIcon = this.desktopIcons.find(i => i.id === iconId);
    if (desktopIcon) {
      if (!this.dockItems.some(item => item.id === desktopIcon.id)) {
        this.dockItems.push({
          id: desktopIcon.id,
          label: desktopIcon.label,
          icon: desktopIcon.icon,
          type: desktopIcon.windowId === 'textedit' ? 'file' : 'app',
          windowId: desktopIcon.windowId,
          fileKey: (desktopIcon as any).fileKey || ''
        });
        this.terminalHistory.push({
          text: `System: Pinned '${desktopIcon.label}' to macOS Dock.`,
          type: 'success'
        });
        this.initIconPositions();
      }
    }
  }

  onDockDragStart(event: DragEvent, index: number) {
    this.draggedDockIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDockDragOver(event: DragEvent, index: number) {
    event.preventDefault();
  }

  onDockDrop(event: DragEvent, index: number) {
    event.preventDefault();
    if (this.draggedDockIndex !== null && this.draggedDockIndex !== index) {
      const movedItem = this.dockItems.splice(this.draggedDockIndex, 1)[0];
      this.dockItems.splice(index, 0, movedItem);
    }
    this.draggedDockIndex = null;
  }

  onDockItemClick(item: any) {
    if (item.type === 'settings') {
      this.toggleClassicMode();
    } else if (item.id === 'about' || item.windowId === 'about' || item.type === 'calendar') {
      this.openWindow('about');
    } else if (item.type === 'file' && item.fileKey) {
      this.openFile(item.fileKey);
    } else if (item.windowId) {
      this.openWindow(item.windowId);
    }
  }

  // Finder Helpers
  navigateFinder(path: string) {
    if (this.currentPath === path) return;

    this.finderHistory = this.finderHistory.slice(0, this.finderHistoryIndex + 1);
    this.finderHistory.push(path);
    this.finderHistoryIndex = this.finderHistory.length - 1;
    this.currentPath = path;
    this.finderSearchQuery = '';
  }

  goFinderBack() {
    if (this.finderHistoryIndex > 0) {
      this.finderHistoryIndex--;
      this.currentPath = this.finderHistory[this.finderHistoryIndex];
      this.finderSearchQuery = '';
    }
  }

  goFinderForward() {
    if (this.finderHistoryIndex < this.finderHistory.length - 1) {
      this.finderHistoryIndex++;
      this.currentPath = this.finderHistory[this.finderHistoryIndex];
      this.finderSearchQuery = '';
    }
  }

  getFinderItems(): FileSystemItem[] {
    const items = this.virtualDirectory[this.currentPath] || [];
    if (!this.finderSearchQuery.trim()) {
      return items;
    }
    const q = this.finderSearchQuery.toLowerCase();
    return items.filter(item => item.name.toLowerCase().includes(q));
  }

  onFinderItemDblClick(item: FileSystemItem) {
    if (item.type === 'folder' && item.targetPath) {
      this.navigateFinder(item.targetPath);
    } else if (item.type === 'app' && item.windowId) {
      this.openWindow(item.windowId);
    } else if (item.type === 'file') {
      if (item.fileKey === 'resume_pdf') {
        this.openWindow('resumeapp');
      } else if (item.fileKey) {
        this.openFile(item.fileKey);
      }
    }
  }

  onIconClick(icon: any) {
    if (this.iconDragMoved) {
      return; // Dragged, don't trigger click action
    }
    if (icon.id === 'resume') {
      this.downloadCV();
    } else if (icon.windowId === 'textedit' && icon.fileKey) {
      this.openFile(icon.fileKey);
    } else {
      this.openWindow(icon.windowId);
    }
  }

  downloadCV() {
    const filePath = 'public/assets/files/Prosenjit_Resume.pdf';
    const fileName = 'Prosenjit_Resume_lts.pdf';

    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Original Scroll Methods
  handleData(data: string) {
    console.log(data);
    this.scrollToSection(data);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.classicMode) {
      this.scrollPosition = window.pageYOffset;
      this.updateActiveSectionId();
    }
  }

  private updateActiveSectionId() {
    if (this.classicMode) {
      const scrollPosition = window.pageYOffset + 100;
      for (let i = this.sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(this.sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          this.activeSectionId = this.sections[i];
          console.log(`Active Section: ${this.activeSectionId}`);
          break;
        }
      }
    }
  }

  scrollToSection(id: string) {
    this.logger.debug("Starting to load Scroll", undefined, "HomeComponent");
    if (this.classicMode) {
      this.activeSectionId = id;
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // In Desktop mode, scroll corresponds to opening the corresponding window!
      if (id === 'home' || id === 'about') {
        this.openWindow('about');
      } else if (id === 'services') {
        this.openWindow('skills');
      } else if (id === 'experience') {
        this.openWindow('experience');
      } else if (id === 'projects') {
        this.openWindow('projects');
      } else if (id === 'contact') {
        this.openWindow('contact');
      }
    }
  }

  onSearchGoogle(query: string) {
    if (!query || !query.trim()) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query.trim())}`, '_blank');
    this.lastSearchedQuery = query.trim();
    this.searchQuery = '';
  }

  fetchGithubData() {
    // Only fetch if profile or repos are not loaded yet to prevent spamming the API
    if (this.githubProfile && this.githubRepos.length > 0) {
      return;
    }

    this.githubLoading = true;
    this.githubError = false;
    this.githubUsingFallback = false;

    // Fetch user profile from environment endpoint
    const githubUserUrl = environment.api?.githubUserUrl || 'https://api.github.com/users/prosenjitGravity';
    const githubReposUrl = environment.api?.githubReposUrl || 'https://api.github.com/users/prosenjitGravity/repos?sort=updated&per_page=30';

    this.http.get(githubUserUrl).subscribe({
      next: (profile: any) => {
        this.githubProfile = profile;

        // Fetch repositories sorted by updated date
        this.http.get(githubReposUrl).subscribe({
          next: (repos: any) => {
            this.githubRepos = repos;
            this.githubLoading = false;
          },
          error: (err) => {
            this.logger.error("Failed to load GitHub repos", err, "HomeComponent");
            this.loadGithubFallback(true);
          }
        });
      },
      error: (err) => {
        this.logger.error("Failed to load GitHub profile", err, "HomeComponent");
        this.loadGithubFallback(false);
      }
    });
  }

  loadGithubFallback(hasProfile: boolean) {
    this.githubUsingFallback = true;
    this.githubLoading = false;
    if (!hasProfile) {
      this.githubProfile = {
        avatar_url: "assets/images/prosenjit_paul.jpg",
        name: "Prosenjit Paul",
        login: "prosenjitGravity",
        bio: "Full Stack Developer | Building resilient web applications, workflow engines, and distributed messaging services.",
        followers: 12,
        following: 15,
        public_repos: 8,
        html_url: "https://github.com/prosenjitGravity"
      };
    }
    this.githubRepos = [
      {
        name: "portfolio",
        description: "A premium macOS desktop-style portfolio built with Angular 19, custom CSS transitions, drag-and-drop window layouts, and live terminal shell simulator.",
        html_url: "https://github.com/prosenjitGravity/portfolio",
        language: "TypeScript",
        stargazers_count: 5,
        forks_count: 1,
        updated_at: new Date().toISOString()
      },
      {
        name: "sna-sparsh-engine",
        description: "Fund management and workflow execution engine with high reliability, queue-based message dispatching, and distributed task workers.",
        html_url: "https://github.com/prosenjitGravity/sna-sparsh-engine",
        language: "JavaScript",
        stargazers_count: 8,
        forks_count: 2,
        updated_at: new Date().toISOString()
      },
      {
        name: "realtime-e-auction",
        description: "End-to-end e-auction bidding platform with WebSocket streaming updates, responsive dashboard panels, and Postgres schema design.",
        html_url: "https://github.com/prosenjitGravity/realtime-e-auction",
        language: "TypeScript",
        stargazers_count: 6,
        forks_count: 0,
        updated_at: new Date().toISOString()
      }
    ];
  }

  fetchLinkedinData() {
    if (this.linkedinLoading || this.linkedinProfile) return;

    this.linkedinLoading = true;
    this.linkedinError = false;
    this.linkedinService.getProfile().subscribe({
      next: ({ profile, experience = [], education = [], activities = [] }) => {
        this.linkedinProfile = profile;
        this.linkedinExperience = experience;
        this.linkedinEducation = education;
        this.linkedinActivities = activities;
        this.linkedinLoading = false;
      },
      error: (error) => {
        this.logger.error('Failed to load LinkedIn profile', error, 'HomeComponent');
        this.linkedinError = true;
        this.linkedinLoading = false;
      }
    });
  }

  // Photo Booth App Helper Methods
  startPhotoBoothCamera() {
    this.photoBoothCountdown = null;
    this.photoBoothFlash = false;
    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      .then(stream => {
        this.photoBoothStream = stream;
        // Bind to video element
        setTimeout(() => {
          const videoEl = document.getElementById('photobooth-video') as HTMLVideoElement;
          if (videoEl) {
            videoEl.srcObject = stream;
          }
        }, 100);
      })
      .catch(err => {
        this.logger.error('Failed to get user camera for Photo Booth', err, 'HomeComponent');
        alert('Could not access camera. Please check camera permissions in your browser settings.');
      });
  }

  stopPhotoBoothCamera() {
    if (this.photoBoothStream) {
      this.photoBoothStream.getTracks().forEach(track => track.stop());
      this.photoBoothStream = null;
    }
    this.photoBoothCountdown = null;
  }

  setPhotoBoothFilter(filterName: string) {
    this.photoBoothFilter = filterName;
  }

  takePhotoBoothPicture() {
    if (this.photoBoothCountdown !== null || !this.photoBoothStream) return;

    this.photoBoothCountdown = 3;
    const interval = setInterval(() => {
      if (this.photoBoothCountdown !== null && this.photoBoothCountdown > 1) {
        this.photoBoothCountdown--;
        this.playPhotoBoothCountdownBeep();
      } else {
        clearInterval(interval);
        this.photoBoothCountdown = null;
        this.triggerPhotoBoothShutter();
      }
    }, 1000);

    this.playPhotoBoothCountdownBeep();
  }

  playPhotoBoothCountdownBeep() {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 1000;
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // Audio context autoplay restriction
    }
  }

  triggerPhotoBoothShutter() {
    // 1. Play Shutter Click Sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 1600;
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {
      // Audio context autoplay restriction
    }

    // 2. Trigger Flash Overlay
    this.photoBoothFlash = true;
    setTimeout(() => {
      this.photoBoothFlash = false;
    }, 180);

    // 3. Capture Video Frame on Canvas with Professional Watermark
    const videoEl = document.getElementById('photobooth-video') as HTMLVideoElement;
    if (videoEl) {
      const canvas = document.createElement('canvas');
      const w = videoEl.videoWidth || 640;
      const h = videoEl.videoHeight || 480;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw flipped camera stream with user-selected filter
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.filter = this.getCanvasFilter(this.photoBoothFilter);
        ctx.drawImage(videoEl, 0, 0, w, h);
        ctx.restore();

        // Reset filter for crisp watermark overlay
        ctx.filter = 'none';

        // --- DRAW COMPREHENSIVE LEICA & MAC PROFESSIONAL METADATA WATERMARK ---
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const filterName = this.getFilterDisplayName(this.photoBoothFilter);
        const shotId = `PJ-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        // 1. Bottom gradient vignette for text legibility
        const grad = ctx.createLinearGradient(0, h - 92, 0, h);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(0.25, 'rgba(10, 15, 30, 0.7)');
        grad.addColorStop(1, 'rgba(3, 7, 18, 0.96)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, h - 92, w, 92);

        // 2. Bottom-Left: Leica Iconic Red Dot & Optics Info
        const redDotX = 22;
        const redDotY = h - 30;
        const redDotRadius = 11;
        ctx.save();
        ctx.fillStyle = '#dc2626'; // Iconic Leica Red
        ctx.shadowColor = 'rgba(220, 38, 38, 0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(redDotX, redDotY, redDotRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // "Leica" script text inside red dot
        ctx.fillStyle = '#ffffff';
        ctx.font = 'italic bold 8px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Leica', redDotX, redDotY);

        // Reset text alignment
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';

        // Camera Model & Optics Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('LEICA M11-P', redDotX + 18, redDotY - 4);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px monospace';
        ctx.fillText(`SUMMILUX-M 35mm f/1.4 ASPH  •  ${filterName.toUpperCase()}`, redDotX + 18, redDotY + 8);

        ctx.fillStyle = '#64748b';
        ctx.font = '8px monospace';
        ctx.fillText(`EXIF: 35mm • f/1.4 • 1/250s • ISO 100 • EV ±0.0 • RAW+JPEG`, redDotX + 18, redDotY + 19);

        // 3. Bottom-Right: Author, Client Network IP, Timestamp & Specs
        const rightX = w - 16;
        ctx.textAlign = 'right';

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('PROSENJIT PAUL', rightX, redDotY - 4);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '9px monospace';
        ctx.fillText(`IP: ${this.clientIp}  •  ${shotId}`, rightX, redDotY + 8);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '8px monospace';
        ctx.fillText(`macOS Sequoia 15.0  •  ${dateStr} ${timeStr}`, rightX, redDotY + 19);

        // Reset text alignment
        ctx.textAlign = 'left';

        // 4. Top-Left Live HUD Camera Badge
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        const topBadgeW = 205;
        const topBadgeH = 24;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(14, 14, topBadgeW, topBadgeH, 5);
        } else {
          ctx.rect(14, 14, topBadgeW, topBadgeH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(24, 26, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '600 9px monospace';
        ctx.fillText(`macOS PHOTO BOOTH • 60 FPS`, 33, 29);
        ctx.restore();

        // 5. Top-Right Telemetry Badge (Geo Location & Resolution)
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        const geoBadgeW = 165;
        const geoBadgeH = 24;
        const geoBadgeX = w - geoBadgeW - 14;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(geoBadgeX, 14, geoBadgeW, geoBadgeH, 5);
        } else {
          ctx.rect(geoBadgeX, 14, geoBadgeW, geoBadgeH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(geoBadgeX + 11, 26, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '600 8.5px monospace';
        ctx.fillText(`22.57°N 88.36°E • ${w}x${h}`, geoBadgeX + 19, 29);
        ctx.restore();

        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        this.photoBoothPhotos.unshift(dataUrl);
      }
    }
  }

  getCanvasFilter(filterName: string): string {
    switch (filterName) {
      case 'leica-look':
        return 'contrast(122%) saturate(125%) brightness(98%)';
      case 'leica-mono':
        return 'grayscale(100%) contrast(148%) brightness(94%)';
      case 'leica-vivid':
        return 'saturate(145%) contrast(115%) brightness(102%) sepia(6%)';
      case 'mac-noir':
        return 'grayscale(100%) contrast(165%) brightness(88%)';
      case 'mac-dramatic':
        return 'sepia(32%) saturate(135%) contrast(118%) hue-rotate(-8deg)';
      case 'mac-cyber':
        return 'saturate(128%) contrast(122%) hue-rotate(185deg) brightness(102%)';
      case 'mac-studio':
        return 'brightness(110%) contrast(110%) saturate(118%)';
      // Legacy backwards-compatibility
      case 'sepia': return 'sepia(100%)';
      case 'grayscale': return 'grayscale(100%)';
      case 'invert': return 'invert(100%)';
      case 'blur': return 'blur(3px)';
      case 'hue-rotate': return 'hue-rotate(90deg)';
      case 'contrast': return 'contrast(200%)';
      default: return 'none';
    }
  }

  getFilterDisplayName(filterName: string): string {
    switch (filterName) {
      case 'leica-look': return 'Leica Look';
      case 'leica-mono': return 'Leica Mono';
      case 'leica-vivid': return 'Leica Vivid';
      case 'mac-noir': return 'Mac Noir';
      case 'mac-dramatic': return 'Dramatic Warm';
      case 'mac-cyber': return 'Dramatic Cool';
      case 'mac-studio': return 'Studio Light';
      case 'sepia': return 'Sepia';
      case 'grayscale': return 'Mono';
      default: return 'Natural';
    }
  }

  deletePhotoBoothPicture(index: number, event: Event) {
    event.stopPropagation();
    this.photoBoothPhotos.splice(index, 1);
  }

  downloadPhotoBoothPicture(photoUrl: string, event: Event) {
    event.stopPropagation();
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `photobooth_snap_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
