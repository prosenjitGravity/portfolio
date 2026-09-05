import { AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { TopbarComponent } from '../topbar/topbar.component';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { ServicesComponent } from '../services/services.component';
import { ExperienceComponent } from '../experience/experience.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { ArchitectureComponent } from '../architecture/architecture.component';
import { ContactComponent } from '../contact/contact.component';
import { FooterComponent } from '../footer/footer.component';

import { LoggerService } from '../../services/logger.service';
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
  @ViewChild('terminalBody') terminalBody!: ElementRef;
  @ViewChild('terminalInputField') terminalInputField!: ElementRef;

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

  // Classic scrolling layout states
  activeSectionId: string = 'home';
  sections: string[] = ['home', 'about', 'services', 'experience', 'projects', 'contact'];
  scrollPosition: number = 0;
  loggingEnabled = true;

  // macOS layout states
  classicMode: boolean = false;
  currentTime: string = '';
  currentDayName: string = '';
  currentDayNum: string = '';
  currentMonthYear: string = '';
  maxZIndex: number = 100;

  // Control center states
  showControlCenter = false;
  wifiActive = true;
  bluetoothActive = true;
  airdropActive = false;
  dndActive = false;
  stageManagerActive = false;
  brightness = 100;
  volume = 50;
  isPlayingMusic = false;

  // Photo booth states
  photoBoothStream: MediaStream | null = null;
  photoBoothFilter = 'none';
  photoBoothCountdown: number | null = null;
  photoBoothPhotos: string[] = [];
  photoBoothFlash = false;
  showPhotoPreview = false;

  // Notifications
  showNotificationPanel = false;
  notifications: Array<{
    id: number;
    appName: string;
    icon: string;
    iconColor: string;
    time: string;
    title: string;
    desc: string;
    actionWindow?: string;
  }> = [];

  // Dragging states
  isDragging = false;
  draggedWindowId: string | null = null;
  dragStartX = 0;
  dragStartY = 0;
  windowStartX = 0;
  windowStartY = 0;

  isDraggingIcon = false;
  draggedIconId: string | null = null;
  iconDragStartX = 0;
  iconDragStartY = 0;
  iconStartX = 0;
  iconStartY = 0;
  iconDragMoved = false;

  lastMouseX = 0;
  lastMouseY = 0;
  draggedDockIndex: number | null = null;

  // Terminal & TextEdit states
  texteditTitle = 'TextEdit — welcome.txt';
  texteditContent = '';
  terminalCommand = '';
  terminalTheme = 'theme-classic';
  terminalHistory: Array<{ text: string; type: 'input' | 'output' | 'error' | 'success' | 'ascii' }> = [];
  commandHistory: string[] = [];
  commandHistoryIndex = -1;

  // Widgets & Telemetry
  githubContributions: number[] = [];
  calendarDays: number[] = [];
  clientIp: string = '127.0.0.1 (en0)';
  clientCity: string = 'Kolkata';
  clientRegion: string = 'West Bengal';
  clientCountry: string = 'India';
  clientCountryCode: string = 'IN';
  clientIsp: string = 'Broadband Network';
  clientLat: string = '22.57';
  clientLon: string = '88.36';

  sessionStartTime: number = Date.now();
  screenTimeSeconds: number = 0;
  screenTimeString: string = '0s';
  screenTimeDetailString: string = '00:00:00';
  screenTimePercentage: number = 6;
  screenTimeNote: string = 'Exploring Desktop Workspace';
  private screenTimeTimer: any;

  cpuLoadPercent: number = 12;
  cpuCores: number = 8;
  memoryUsedGb: string = '4.2';
  memoryTotalGb: string = '8.0';
  memoryPercent: number = 52;
  private systemPerformanceTimer: any;
  private audioContext: AudioContext | null = null;

  // Google Search states
  searchQuery = '';
  lastSearchedQuery = '';

  // Finder / Explorer states
  currentPath = '/Desktop';
  finderHistory = ['/Desktop'];
  finderHistoryIndex = 0;
  finderSearchQuery = '';

  // Window list configuration
  windows: { [key: string]: WindowState } = {
    about: { id: 'about', title: 'About Me', open: false, minimized: false, maximized: false, x: 200, y: 100, zIndex: 10 },
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
    // { id: 'photobooth', label: 'Photo Booth', iconClass: 'photobooth-icon-item', icon: 'fas fa-camera', windowId: 'photobooth', x: 0, y: 0, fileKey: '' }
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
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog', type: 'settings', windowId: '', fileKey: '' }
  ];

  private logTemplates = [
    { tag: 'SYSTEM', type: 'system', message: 'Initializing macOS Desktop environment...' },
    { tag: 'LOAD', type: 'success', message: 'Fetched profile details from local database.' },
    { tag: 'PROJECTS', type: 'queue', message: 'Portfolios components registered in window manager.' },
    { tag: 'DOCK', type: 'db', message: 'macOS Dock magnification physics engine mounted.' },
    { tag: 'SUCCESS', type: 'success', message: 'All system services operational. Desktop loaded.' }
  ];

  virtualFiles: { [key: string]: { title: string; content: string } } = {
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
- Double-click desktop file icons to read them.
- Open Terminal from the Dock to run interactive CLI commands (try 'help' or 'neofetch').

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
Highly motivated and results-driven Software Developer with experience in designing, building, and optimizing scalable web applications. Skilled in backend architecture (Node.js, Express, PostgreSQL, RabbitMQ), frontend development (Angular, TypeScript), and cloud deployment.

---

### PROFESSIONAL EXPERIENCE

#### 1. Software Developer | SISL Infotech Pvt. Ltd. (NIC)
*Aug 2024 — Present | Kolkata, India*
- Contributing to a secure government financial management platform and digital governance workflows.
- Engineered multi-tier scheme fund transfer mechanisms across State, District, Block, and Village levels.
- Architected granular user mapping and administrative hierarchy models with multi-level RBAC.
- Developed RESTful APIs (.NET Core), modular Angular interfaces, and RabbitMQ message queues.
- Tech Stack: .NET Core, Angular, RabbitMQ, PostgreSQL, REST APIs, Microservices

#### 2. Junior Software Developer | Phloxblog
*Aug 2023 — Aug 2024 | Kolkata, India*
- Engineered core modules for a real-time e-auction platform with WebSocket live bid streaming.
- Optimized PostgreSQL database performance through schema redesign and query tuning.
- Built Node.js / Express REST APIs with secure JWT authentication and transaction pipelines.
- Tech Stack: Angular, TypeScript, Node.js, Express, PostgreSQL, WebSockets, AWS

---

### EDUCATION
- Master of Computer Applications (MCA)
- Bachelor of Computer Applications (BCA)
---

### SKILLS & TECH STACK
- Languages: .NET Core, Java, JavaScript, TypeScript, HTML/CSS, SQL
- Backend: .NET Core, Node.js, Express, Spring Boot, RabbitMQ, Kafka, WebSockets, REST APIs
- Frontend: Angular, HTML5, CSS3, SCSS
- Databases: PostgreSQL, MongoDB, Redis
- DevOps & Cloud: Docker, AWS (EC2, S3, ELB), CI/CD`
    },
    secret: {
      title: 'Secret.txt',
      content: `🕵️‍♂️ CONGRATULATIONS! YOU FOUND THE SECRET FILE!

Easter Eggs & Terminal Commands to try:
1. "neofetch" - displays a retro system diagnostic screen.
2. "sudo rm -rf /" - see what happens when you try to wipe the system.
3. "theme matrix" or "theme dracula" - changes the terminal skin!
4. "screentime" - prints live session metrics.

Thanks for visiting my portfolio!`
    },
    experience_summary: {
      title: 'Work_Experience.txt',
      content: `==================================================
💼 WORK EXPERIENCE SUMMARY - PROSENJIT PAUL
==================================================

1. SOFTWARE DEVELOPER | SISL Infotech Pvt. Ltd. (NIC)
   Aug 2024 — Present | Kolkata, India
   - Government financial management platform (scheme disbursements & digital workflows)
   - Multi-tier scheme fund transfers (State -> District -> Block -> Village level)
   - RBAC security models, RESTful APIs, modular Angular UI, and RabbitMQ queues
   - Tech Stack: .NET Core, Angular, RabbitMQ, PostgreSQL, REST APIs

2. JUNIOR SOFTWARE DEVELOPER | Phloxblog
   Aug 2023 — Aug 2024 | Kolkata, India
   - Real-time E-Auction platform with sub-second WebSocket updates
   - Database schema redesign, indexing strategies, and API performance tuning
   - Tech Stack: Angular, Node.js, Express, PostgreSQL, WebSockets, AWS`
    },
    skills_summary: {
      title: 'Skills_Inventory.txt',
      content: `==================================================
🛠️ TECHNICAL SKILLS & STACK
==================================================

- LANGUAGES: .NET Core, Java, JavaScript (ES6+), TypeScript, SQL, HTML5, CSS3, SCSS
- BACKEND: Node.js, Express, Spring Boot, RabbitMQ, Kafka, WebSockets, RESTful APIs
- FRONTEND: Angular, RxJS, Responsive Design
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

- BCA (Bachelor of Computer Applications)
  Specialization: Algorithms, Operating Systems, Networking

- HIGHLIGHTS:
  - Docker Containerization & Cloud Deployment
  - Active LeetCode Problem Solving (leetcode.com/u/prosenjitGravity)`
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

  ngOnInit(): void {
    this.loggingEnabled = this.logger.getConfig().enabled;
    this.fetchClientIp();

    this.sessionStartTime = Date.now();
    this.updateScreenTime();
    this.screenTimeTimer = setInterval(() => this.updateScreenTime(), 1000);

    this.updateSystemPerformance();
    this.systemPerformanceTimer = setInterval(() => this.updateSystemPerformance(), 2000);

    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 10000);

    this.adjustWindowSizes();
    this.initIconPositions();
    this.initTerminal();
    this.initNotifications();
    this.initCalendarGrid();
    this.initGithubContributions();
  }

  ngAfterViewInit(): void {
    this.updateActiveSectionId();
  }

  ngOnDestroy(): void {
    if (this.screenTimeTimer) clearInterval(this.screenTimeTimer);
    if (this.systemPerformanceTimer) clearInterval(this.systemPerformanceTimer);
    this.stopPhotoBoothCamera();
  }

  // Telemetry & Metrics
  updateSystemPerformance(): void {
    this.cpuCores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 8;
    const openCount = Object.keys(this.windows).filter(k => this.windows[k].open && !this.windows[k].minimized).length;
    let baseLoad = 8 + (openCount * 2.5) + (this.photoBoothStream ? 10 : 0) + (this.isDragging ? 6 : 0);
    const fluctuation = (Math.random() * 5) - 2.5;
    this.cpuLoadPercent = Math.max(5, Math.min(96, Math.round(baseLoad + fluctuation)));

    const perf = typeof window !== 'undefined' ? (window.performance as any) : null;
    if (perf?.memory?.usedJSHeapSize) {
      const usedMb = perf.memory.usedJSHeapSize / (1024 * 1024);
      const sysUsed = (3.4 + (usedMb / 350)).toFixed(1);
      this.memoryUsedGb = sysUsed;
      this.memoryPercent = Math.min(90, Math.round((parseFloat(sysUsed) / 8.0) * 100));
    } else {
      const simulatedMem = (3.8 + (openCount * 0.2) + (Math.random() * 0.2)).toFixed(1);
      this.memoryUsedGb = simulatedMem;
      this.memoryPercent = Math.min(90, Math.round((parseFloat(simulatedMem) / 8.0) * 100));
    }
  }

  updateScreenTime(): void {
    this.screenTimeSeconds = Math.floor((Date.now() - this.sessionStartTime) / 1000);
    const hrs = Math.floor(this.screenTimeSeconds / 3600);
    const mins = Math.floor((this.screenTimeSeconds % 3600) / 60);
    const secs = this.screenTimeSeconds % 60;

    if (hrs > 0) {
      this.screenTimeString = `${hrs}h ${mins}m`;
    } else if (mins > 0) {
      this.screenTimeString = `${mins}m ${secs}s`;
    } else {
      this.screenTimeString = `${secs}s`;
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    this.screenTimeDetailString = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    this.screenTimePercentage = Math.min(100, Math.max(6, Math.round((this.screenTimeSeconds / 900) * 100)));

    if (this.isWindowFocused('terminal')) {
      this.screenTimeNote = 'Developer Shell Active';
    } else if (this.isWindowFocused('photobooth')) {
      this.screenTimeNote = 'Photo Booth / Camera';
    } else if (this.isWindowFocused('projects') || this.isWindowFocused('experience')) {
      this.screenTimeNote = 'Reviewing Work & Projects';
    } else if (this.isWindowFocused('about')) {
      this.screenTimeNote = 'Reading About Me';
    } else if (this.isWindowFocused('contact')) {
      this.screenTimeNote = 'Composing Message';
    } else if (this.hasAnyOpenWindow()) {
      this.screenTimeNote = 'Multitasking in macOS';
    } else {
      this.screenTimeNote = 'Exploring Desktop Workspace';
    }
  }

  initNotifications(): void {
    const locationStr = this.clientCity && this.clientCountry ? `${this.clientCity}, ${this.clientCountry}` : 'your region';
    this.notifications = [
      {
        id: 1,
        appName: 'System Workspace',
        icon: 'fas fa-laptop-code',
        iconColor: '#0a84ff',
        time: 'Just now',
        title: "Welcome to Prosenjit's Portfolio",
        desc: `Interactive macOS session initiated from ${locationStr}. Feel free to explore apps, review code, or use the developer terminal.`,
        actionWindow: 'about'
      },
      {
        id: 4,
        appName: 'Developer Terminal',
        icon: 'fas fa-terminal',
        iconColor: '#bf5af2',
        time: '15m ago',
        title: 'Interactive Shell Active',
        desc: "Try running 'help', 'neofetch', 'screentime', or 'skills' in the zsh terminal console.",
        actionWindow: 'terminal'
      }
    ];
  }

  handleNotificationClick(note: { actionWindow?: string }): void {
    if (note.actionWindow) {
      this.openWindow(note.actionWindow);
      this.showNotificationPanel = false;
    }
  }

  fetchClientIp(): void {
    fetch('https://ipwho.is/')
      .then(res => res.json())
      .then(data => {
        if (data && data.success !== false && data.ip) {
          this.clientIp = data.ip;
          this.clientCity = data.city || 'Kolkata';
          this.clientRegion = data.region || 'West Bengal';
          this.clientCountry = data.country || 'India';
          this.clientCountryCode = data.country_code || 'IN';
          this.clientIsp = data.connection?.isp || data.connection?.org || 'Broadband Network';
          this.clientLat = data.latitude ? data.latitude.toFixed(2) : '22.57';
          this.clientLon = data.longitude ? data.longitude.toFixed(2) : '88.36';
          this.initNotifications();
        } else {
          this.fallbackIpFetch();
        }
      })
      .catch(() => this.fallbackIpFetch());
  }

  private fallbackIpFetch(): void {
    const ipEndpoint = environment.api?.ipGeoApiUrl || 'https://api.ipify.org?format=json';
    fetch(ipEndpoint)
      .then(res => res.json())
      .then(data => {
        if (data?.ip) this.clientIp = data.ip;
        this.initNotifications();
      })
      .catch(() => {
        this.clientIp = '192.168.1.108';
        this.initNotifications();
      });
  }

  initGithubContributions(): void {
    this.githubContributions = Array.from({ length: 112 }, () => {
      const rand = Math.random();
      if (rand < 0.45) return 0;
      if (rand < 0.75) return 1;
      if (rand < 0.92) return 2;
      return 3;
    });
  }

  initCalendarGrid(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.currentMonthYear = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    this.calendarDays = [...Array(firstDay).fill(0), ...Array.from({ length: totalDays }, (_, i) => i + 1)];
  }

  // Terminal Methods
  initTerminal(): void {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    this.terminalHistory = [
      { text: `Last login: ${now.toDateString()} ${timeStr} on ttys001`, type: 'output' },
      ...this.logTemplates.map(t => ({
        text: `[${t.tag}] ${t.message}`,
        type: (t.type === 'success' ? 'success' : (t.type === 'system' ? 'ascii' : 'output')) as any
      })),
      { text: `\nWelcome to Prosenjit's interactive shell. Type 'help' to list available commands.\n`, type: 'ascii' }
    ];
  }

  focusTerminalInput(): void {
    this.terminalInputField?.nativeElement.focus();
  }

  onTerminalSubmit(): void {
    const cmd = this.terminalCommand.trim();
    if (!cmd) return;

    this.terminalHistory.push({ text: cmd, type: 'input' });
    this.commandHistory.push(cmd);
    this.commandHistoryIndex = this.commandHistory.length;
    this.terminalCommand = '';

    this.executeCommand(cmd);
    this.scrollToTerminalBottom();
  }

  onTerminalPrevCommand(event: Event): void {
    event.preventDefault();
    if (this.commandHistory.length === 0) return;
    if (this.commandHistoryIndex > 0) {
      this.commandHistoryIndex--;
      this.terminalCommand = this.commandHistory[this.commandHistoryIndex];
    }
  }

  onTerminalNextCommand(event: Event): void {
    event.preventDefault();
    if (this.commandHistoryIndex < this.commandHistory.length - 1) {
      this.commandHistoryIndex++;
      this.terminalCommand = this.commandHistory[this.commandHistoryIndex];
    } else {
      this.commandHistoryIndex = this.commandHistory.length;
      this.terminalCommand = '';
    }
  }

  scrollToTerminalBottom(): void {
    setTimeout(() => {
      if (this.terminalBody) {
        this.terminalBody.nativeElement.scrollTop = this.terminalBody.nativeElement.scrollHeight;
      }
    }, 10);
  }

  executeCommand(cmdStr: string): void {
    const parts = cmdStr.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (command) {
      case 'help':
      case '?':
        this.terminalHistory.push({
          text: `Available Commands:
  help / ?            - Show this list of commands
  screentime / uptime - Display live session screen time
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
  gui                 - Toggle classic portfolio layout`,
          type: 'output'
        });
        break;
      case 'about':
        this.terminalHistory.push({
          text: `Prosenjit Paul - Full Stack Developer\nLocation: Kolkata, India\nBio: Building dependable software for complex, real-world systems.\nSpecialization: Node.js, Express, Angular, Postgres, RabbitMQ, AWS.\nUse 'open about' to open the GUI window.`,
          type: 'output'
        });
        break;
      case 'skills':
        this.terminalHistory.push({
          text: `Languages:   .NET Core, Java, JavaScript, TypeScript, HTML/CSS, SQL\nBackend:     .NET Core, Node.js, Express, Spring Boot, RabbitMQ, Kafka, WebSockets, REST APIs\nFrontend:    Angular, HTML5, CSS3, SCSS\nDatabases:   PostgreSQL, MongoDB, Redis\nDevOps:      Docker, AWS (EC2, S3, ELB), CI/CD`,
          type: 'output'
        });
        break;
      case 'experience':
        this.terminalHistory.push({
          text: `1. Software Developer @ SISL Infotech Pvt. Ltd. (NIC) [Aug 2024 - Present]\n   - Government financial management platform & digital governance workflows.\n   - Multi-tier scheme fund transfers (State -> District -> Block -> Village level).\n   - REST APIs (.NET Core), Angular, RabbitMQ queues, PostgreSQL.\n2. Junior Software Developer @ Phloxblog [Aug 2023 - Aug 2024]\n   - Real-time E-Auction platform with WebSocket streaming.\n   - PostgreSQL database performance & AWS deployments.`,
          type: 'output'
        });
        break;
      case 'projects':
        this.terminalHistory.push({
          text: `Major Projects:\n  - SNA-Sparsh Scheme Engine (NIC)\n  - Real-time E-Auction Web App\n  - Developer Portfolio & macOS Simulator\nUse 'open projects' to view Projects Explorer.`,
          type: 'output'
        });
        break;
      case 'contact':
        this.terminalHistory.push({
          text: `Email:    paul.prosenjitbit@gmail.com\nLinkedIn: linkedin.com/in/prosenjit-paul-0a82b6239\nGitHub:   github.com/prosenjitGravity`,
          type: 'output'
        });
        break;
      case 'ls':
        this.terminalHistory.push({ text: `Welcome.txt    Resume.md    Secret.txt    Resume.pdf`, type: 'success' });
        break;
      case 'cat':
        this.printCat(args);
        break;
      case 'open':
        this.printOpen(args);
        break;
      case 'neofetch':
      case 'sysinfo':
        this.terminalHistory.push({
          text: `                .88888888:.            guest@prosenjit-desktop
              .88888888.88888.         -----------------------
             .8888888888888888.        OS: macOS Sequoia 15.0 (Virtual)
            .888888888888888888        Kernel: Antigravity-v3.5.0
            88888888888888888888       Uptime: ${this.screenTimeString}
           :88888888888888888888.      Shell: zsh (interactive)
           .88888888888888888888.      Resolution: 1920x1080
           .88888888888888888888       DE: Aqua (Glassmorphic)
           88888888888888888888        WM: Quartz Window Manager
            888888888888888888         CPU: Apple M3 Max (8 Core)
             .8888888888888888          GPU: Apple M3 Integrated GPU
              .88888888.88888.          Memory: 32 GB LPDDR5
                ..::8888::..            Host: Prosenjit's Portfolio Server`,
          type: 'ascii'
        });
        break;
      case 'clear':
      case 'cls':
        this.terminalHistory = [];
        break;
      case 'theme':
        this.setTerminalTheme(args);
        break;
      case 'sudo':
        this.terminalHistory.push({ text: `sudo: permission denied. Access restricted. 😉`, type: 'error' });
        break;
      case 'screentime':
      case 'uptime':
      case 'time':
        this.terminalHistory.push({
          text: `⏱️ Active Screen Time: ${this.screenTimeString} (${this.screenTimeDetailString})\n📊 Focus: ${this.screenTimeNote}`,
          type: 'success'
        });
        break;
      case 'download-resume':
        this.downloadCV();
        this.terminalHistory.push({ text: `Triggered resume download successfully.`, type: 'success' });
        break;
      case 'gui':
      case 'classic':
        this.toggleClassicMode();
        this.terminalHistory.push({ text: `Toggling classic scrolling layout.`, type: 'success' });
        break;
      default:
        this.terminalHistory.push({ text: `zsh: command not found: ${command}. Type 'help' to see commands.`, type: 'error' });
    }
  }

  private printCat(fileName: string): void {
    if (!fileName) {
      this.terminalHistory.push({ text: `Usage: cat [filename]`, type: 'error' });
      return;
    }
    const key = fileName.toLowerCase().replace('.txt', '').replace('.md', '').trim();
    if (this.virtualFiles[key]) {
      this.terminalHistory.push({ text: this.virtualFiles[key].content, type: 'output' });
    } else if (key === 'resume.pdf') {
      this.terminalHistory.push({ text: `resume.pdf is a binary file. Use 'download-resume' or 'open resume'.`, type: 'error' });
    } else {
      this.terminalHistory.push({ text: `cat: ${fileName}: No such file or directory`, type: 'error' });
    }
  }

  private printOpen(appName: string): void {
    if (!appName) {
      this.terminalHistory.push({ text: `Usage: open [app_name | file_name]`, type: 'error' });
      return;
    }
    const name = appName.toLowerCase().trim();
    const appMap: { [key: string]: string } = {
      about: 'about',
      'about me': 'about',
      projects: 'projects',
      portfolio: 'projects',
      skills: 'skills',
      services: 'skills',
      experience: 'experience',
      education: 'education',
      certificates: 'education',
      contact: 'contact',
      mail: 'contact',
      google: 'google',
      browser: 'google',
      github: 'github',
      linkedin: 'linkedin',
      resume: 'resumeapp',
      'resume.pdf': 'resumeapp'
    };

    if (appMap[name]) {
      this.openWindow(appMap[name]);
      this.terminalHistory.push({ text: `Opening ${appName}...`, type: 'success' });
    } else if (this.virtualFiles[name.replace('.txt', '').replace('.md', '')]) {
      this.openFile(name.replace('.txt', '').replace('.md', ''));
      this.terminalHistory.push({ text: `Opening ${appName} in TextEdit...`, type: 'success' });
    } else {
      this.terminalHistory.push({ text: `open: ${appName}: App or file not found.`, type: 'error' });
    }
  }

  private setTerminalTheme(themeName: string): void {
    const validThemes = ['classic', 'matrix', 'dracula', 'retro'];
    const name = themeName.trim().toLowerCase();
    if (validThemes.includes(name)) {
      this.terminalTheme = `theme-${name}`;
      this.terminalHistory.push({ text: `Terminal theme switched to '${name}'.`, type: 'success' });
    } else {
      this.terminalHistory.push({ text: `Available themes: ${validThemes.join(', ')}`, type: 'output' });
    }
  }

  // Window Management
  openWindow(id: string): void {
    if (!this.windows[id]) return;

    if (id === 'github') this.fetchGithubData();
    if (id === 'linkedin') this.fetchLinkedinData();
    if (id === 'photobooth') this.startPhotoBoothCamera();

    if (this.windows[id].minimized) {
      this.windows[id].minimized = false;
      this.windows[id].open = true;
      this.windows[id].restoring = true;
      this.focusWindow(id);
      setTimeout(() => (this.windows[id].restoring = false), 350);
    } else {
      this.windows[id].open = true;
      this.windows[id].minimized = false;
      this.focusWindow(id);
    }
  }

  closeWindow(id: string, event?: Event): void {
    event?.stopPropagation();
    if (this.windows[id]) {
      this.windows[id].open = false;
      if (id === 'photobooth') this.stopPhotoBoothCamera();
    }
  }

  minimizeWindow(id: string, event?: Event): void {
    event?.stopPropagation();
    if (window.innerWidth < 768 || !this.windows[id]) return;

    this.windows[id].minimizing = true;
    if (id === 'photobooth') this.stopPhotoBoothCamera();
    setTimeout(() => {
      this.windows[id].minimized = true;
      this.windows[id].minimizing = false;
    }, 350);
  }

  maximizeWindow(id: string, event?: Event): void {
    event?.stopPropagation();
    if (this.windows[id]) {
      this.windows[id].maximized = !this.windows[id].maximized;
      this.focusWindow(id);
    }
  }

  focusWindow(id: string): void {
    this.maxZIndex += 1;
    if (this.windows[id]) {
      this.windows[id].zIndex = this.maxZIndex;
    }
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

  toggleClassicMode(): void {
    this.classicMode = !this.classicMode;
    if (this.photoBoothStream) this.stopPhotoBoothCamera();
  }

  openFile(fileKey: string): void {
    const file = this.virtualFiles[fileKey];
    if (file) {
      this.texteditTitle = `TextEdit — ${file.title}`;
      this.texteditContent = file.content;
      this.openWindow('textedit');
    }
  }

  // Dragging & Desktop Icons
  onMouseDown(event: MouseEvent, id: string): void {
    const target = event.target as HTMLElement;
    if (target.closest('.mac-window-controls') || target.closest('.mac-window-btn') || this.windows[id].maximized) {
      return;
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

  onTouchStart(event: TouchEvent, id: string): void {
    const target = event.target as HTMLElement;
    if (target.closest('.mac-window-controls') || target.closest('.mac-window-btn') || this.windows[id].maximized) {
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

  onIconMouseDown(event: MouseEvent, id: string): void {
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

  onIconTouchStart(event: TouchEvent, id: string): void {
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

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;

    if (this.isDragging && this.draggedWindowId) {
      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;
      let newX = this.windowStartX + deltaX;
      let newY = this.windowStartY + deltaY;

      const desktopHeight = window.innerHeight;
      const desktopWidth = window.innerWidth;
      if (newY < 28) newY = 28;
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
        const desktopWidth = window.innerWidth;
        const desktopHeight = window.innerHeight;
        icon.x = Math.min(Math.max(newX, 10), desktopWidth - 90);
        icon.y = Math.min(Math.max(newY, 40), desktopHeight - 120);
      }
    }
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
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
      if (newY < 28) newY = 28;
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
        icon.x = Math.min(Math.max(newX, 10), desktopWidth - 90);
        icon.y = Math.min(Math.max(newY, 40), desktopHeight - 120);
      }
    }
  }

  @HostListener('window:mouseup')
  onMouseUp(): void {
    this.handleDragRelease();
  }

  @HostListener('window:touchend')
  onTouchEnd(): void {
    this.handleDragRelease();
  }

  private handleDragRelease(): void {
    this.isDragging = false;
    this.draggedWindowId = null;

    if (this.isDraggingIcon && this.draggedIconId) {
      const iconId = this.draggedIconId;
      const dockEl = document.querySelector('.mac-dock');
      let pinned = false;
      if (dockEl) {
        const rect = dockEl.getBoundingClientRect();
        if (this.lastMouseX >= rect.left && this.lastMouseX <= rect.right && this.lastMouseY >= rect.top && this.lastMouseY <= rect.bottom) {
          this.pinIconToDock(iconId);
          pinned = true;
        }
      }

      if (!pinned) {
        const icon = this.desktopIcons.find(i => i.id === iconId);
        if (icon) {
          this.resolveIconCollision(icon, this.iconStartX, this.iconStartY);
        }
      }
    }

    setTimeout(() => {
      this.isDraggingIcon = false;
      this.draggedIconId = null;
    }, 50);
  }

  resolveIconCollision(icon: { id: string; x: number; y: number }, originalX: number, originalY: number): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const minX = 15;
    const maxX = Math.max(minX, width - 95);
    const minY = 40;
    const maxY = Math.max(minY, height - 120);
    const collisionDistance = 68;

    const isOverlap = (tx: number, ty: number): boolean => {
      return this.desktopIcons.some(other =>
        other.id !== icon.id &&
        Math.abs(other.x - tx) < collisionDistance &&
        Math.abs(other.y - ty) < collisionDistance
      );
    };

    if (!isOverlap(icon.x, icon.y)) return;

    const stepX = 85;
    const stepY = 85;
    let bestX = originalX;
    let bestY = originalY;
    let minDistance = Infinity;
    let found = false;

    for (let r = 1; r <= 5; r++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dy = -r; dy <= r; dy++) {
          if (Math.abs(dx) === r || Math.abs(dy) === r) {
            const candidateX = Math.min(Math.max(icon.x + dx * stepX, minX), maxX);
            const candidateY = Math.min(Math.max(icon.y + dy * stepY, minY), maxY);

            if (!isOverlap(candidateX, candidateY)) {
              const dist = Math.hypot(candidateX - icon.x, candidateY - icon.y);
              if (dist < minDistance) {
                minDistance = dist;
                bestX = candidateX;
                bestY = candidateY;
                found = true;
              }
            }
          }
        }
      }
      if (found) break;
    }

    icon.x = found ? bestX : originalX;
    icon.y = found ? bestY : originalY;
  }

  pinIconToDock(iconId: string): void {
    const desktopIcon = this.desktopIcons.find(i => i.id === iconId);
    if (desktopIcon && !this.dockItems.some(item => item.id === desktopIcon.id)) {
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

  onDockDragStart(event: DragEvent, index: number): void {
    this.draggedDockIndex = index;
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  onDockDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
  }

  onDockDrop(event: DragEvent, index: number): void {
    event.preventDefault();
    if (this.draggedDockIndex !== null && this.draggedDockIndex !== index) {
      const movedItem = this.dockItems.splice(this.draggedDockIndex, 1)[0];
      this.dockItems.splice(index, 0, movedItem);
    }
    this.draggedDockIndex = null;
  }

  onDockItemClick(item: any): void {
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

  onIconClick(icon: any): void {
    if (this.iconDragMoved) return;
    if (icon.id === 'resume') {
      this.downloadCV();
    } else if (icon.windowId === 'textedit' && icon.fileKey) {
      this.openFile(icon.fileKey);
    } else {
      this.openWindow(icon.windowId);
    }
  }

  // Finder Helpers
  navigateFinder(path: string): void {
    if (this.currentPath === path) return;
    this.finderHistory = this.finderHistory.slice(0, this.finderHistoryIndex + 1);
    this.finderHistory.push(path);
    this.finderHistoryIndex = this.finderHistory.length - 1;
    this.currentPath = path;
    this.finderSearchQuery = '';
  }

  goFinderBack(): void {
    if (this.finderHistoryIndex > 0) {
      this.finderHistoryIndex--;
      this.currentPath = this.finderHistory[this.finderHistoryIndex];
      this.finderSearchQuery = '';
    }
  }

  goFinderForward(): void {
    if (this.finderHistoryIndex < this.finderHistory.length - 1) {
      this.finderHistoryIndex++;
      this.currentPath = this.finderHistory[this.finderHistoryIndex];
      this.finderSearchQuery = '';
    }
  }

  getFinderItems(): FileSystemItem[] {
    const items = this.virtualDirectory[this.currentPath] || [];
    if (!this.finderSearchQuery.trim()) return items;
    const q = this.finderSearchQuery.toLowerCase();
    return items.filter(item => item.name.toLowerCase().includes(q));
  }

  onFinderItemDblClick(item: FileSystemItem): void {
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

  // Date, Time & Resizing
  updateDateTime(): void {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.currentDayName = days[now.getDay()].toUpperCase();
    this.currentDayNum = now.getDate().toString();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    this.currentTime = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${hours}:${minutes} ${ampm}`;
  }

  adjustWindowSizes(): void {
    if (window.innerWidth < 768) {
      Object.keys(this.windows).forEach(key => {
        this.windows[key].x = 10;
        this.windows[key].y = 60;
      });
    }
  }

  initIconPositions(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < 768) {
      const startX = 20;
      const startY = 40;
      this.desktopIcons.forEach((icon, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        icon.x = startX + (col * (width - 40) / 4);
        icon.y = startY + (row * 75);
      });
    } else {
      const startX = width - 110;
      const startY = 40;
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
  onResize(): void {
    this.adjustWindowSizes();
    this.initIconPositions();
  }

  // Control Center & UI Popups
  toggleControlCenter(event?: Event): void {
    event?.stopPropagation();
    this.showControlCenter = !this.showControlCenter;
    if (this.showControlCenter) this.showNotificationPanel = false;
  }

  toggleNotificationPanel(event?: Event): void {
    event?.stopPropagation();
    this.showNotificationPanel = !this.showNotificationPanel;
    if (this.showNotificationPanel) this.showControlCenter = false;
  }

  clearNotifications(): void {
    this.notifications = [];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.control-center-panel') && !target.closest('.control-center-trigger')) {
      this.showControlCenter = false;
    }
    if (!target.closest('.notification-panel') && !target.closest('.notification-trigger')) {
      this.showNotificationPanel = false;
    }
  }

  playVolumeBeep(): void {
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
      gainNode.gain.setValueAtTime((this.volume / 100) * 0.15, this.audioContext.currentTime);

      osc.start();
      osc.stop(this.audioContext.currentTime + 0.1);
    } catch (e) {
      // Audio autoplay policy handled
    }
  }

  openPhotoPreview(event?: Event): void {
    event?.stopPropagation();
    this.showPhotoPreview = true;
  }

  closePhotoPreview(): void {
    this.showPhotoPreview = false;
  }

  openDirectMessage(): void {
    if (this.classicMode) {
      this.scrollToSection('contact');
    } else {
      this.openWindow('contact');
    }
  }

  toggleMusicPlay(): void {
    this.isPlayingMusic = !this.isPlayingMusic;
  }

  downloadCV(): void {
    const link = document.createElement('a');
    link.href = 'public/assets/files/Prosenjit_Resume.pdf';
    link.download = 'Prosenjit_Resume_lts.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Classic Scroll Navigation
  handleData(data: string): void {
    this.scrollToSection(data);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.classicMode) {
      this.scrollPosition = window.pageYOffset;
      this.updateActiveSectionId();
    }
  }

  private updateActiveSectionId(): void {
    if (this.classicMode) {
      const scrollPosition = window.pageYOffset + 100;
      for (let i = this.sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(this.sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          this.activeSectionId = this.sections[i];
          break;
        }
      }
    }
  }

  scrollToSection(id: string): void {
    if (this.classicMode) {
      this.activeSectionId = id;
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const windowMap: { [key: string]: string } = {
        home: 'about',
        about: 'about',
        services: 'skills',
        experience: 'experience',
        projects: 'projects',
        contact: 'contact'
      };
      if (windowMap[id]) this.openWindow(windowMap[id]);
    }
  }

  onSearchGoogle(query: string): void {
    if (!query?.trim()) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query.trim())}`, '_blank');
    this.lastSearchedQuery = query.trim();
    this.searchQuery = '';
  }

  // External APIs (GitHub & LinkedIn)
  fetchGithubData(): void {
    if (this.githubProfile && this.githubRepos.length > 0) return;

    this.githubLoading = true;
    this.githubError = false;
    this.githubUsingFallback = false;

    const githubUserUrl = environment.api?.githubUserUrl || 'https://api.github.com/users/prosenjitGravity';
    const githubReposUrl = environment.api?.githubReposUrl || 'https://api.github.com/users/prosenjitGravity/repos?sort=updated&per_page=30';

    this.http.get(githubUserUrl).subscribe({
      next: (profile: any) => {
        this.githubProfile = profile;
        this.http.get(githubReposUrl).subscribe({
          next: (repos: any) => {
            this.githubRepos = repos;
            this.githubLoading = false;
          },
          error: (err) => {
            this.logger.error('Failed to load GitHub repos', err, 'HomeComponent');
            this.loadGithubFallback(true);
          }
        });
      },
      error: (err) => {
        this.logger.error('Failed to load GitHub profile', err, 'HomeComponent');
        this.loadGithubFallback(false);
      }
    });
  }

  private loadGithubFallback(hasProfile: boolean): void {
    this.githubUsingFallback = true;
    this.githubLoading = false;
    if (!hasProfile) {
      this.githubProfile = {
        avatar_url: 'assets/images/prosenjit_paul.jpg',
        name: 'Prosenjit Paul',
        login: 'prosenjitGravity',
        bio: 'Full Stack Developer | Building resilient web applications, workflow engines, and distributed messaging services.',
        followers: 12,
        following: 15,
        public_repos: 8,
        html_url: 'https://github.com/prosenjitGravity'
      };
    }
    this.githubRepos = [
      {
        name: 'portfolio',
        description: 'A premium macOS desktop-style portfolio built with Angular 19, custom CSS transitions, drag-and-drop window layouts, and live terminal shell simulator.',
        html_url: 'https://github.com/prosenjitGravity/portfolio',
        language: 'TypeScript',
        stargazers_count: 5,
        forks_count: 1,
        updated_at: new Date().toISOString()
      },
      {
        name: 'sna-sparsh-engine',
        description: 'Fund management and workflow execution engine with high reliability, queue-based message dispatching, and distributed task workers.',
        html_url: 'https://github.com/prosenjitGravity/sna-sparsh-engine',
        language: 'JavaScript',
        stargazers_count: 8,
        forks_count: 2,
        updated_at: new Date().toISOString()
      },
      {
        name: 'realtime-e-auction',
        description: 'End-to-end e-auction bidding platform with WebSocket streaming updates, responsive dashboard panels, and Postgres schema design.',
        html_url: 'https://github.com/prosenjitGravity/realtime-e-auction',
        language: 'TypeScript',
        stargazers_count: 6,
        forks_count: 0,
        updated_at: new Date().toISOString()
      }
    ];
  }

  fetchLinkedinData(): void {
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

  // Photo Booth
  startPhotoBoothCamera(): void {
    this.photoBoothCountdown = null;
    this.photoBoothFlash = false;
    navigator.mediaDevices?.getUserMedia({ video: { width: 640, height: 480 } })
      .then(stream => {
        this.photoBoothStream = stream;
        setTimeout(() => {
          const videoEl = document.getElementById('photobooth-video') as HTMLVideoElement;
          if (videoEl) videoEl.srcObject = stream;
        }, 100);
      })
      .catch(err => {
        this.logger.error('Failed to get camera for Photo Booth', err, 'HomeComponent');
      });
  }

  stopPhotoBoothCamera(): void {
    if (this.photoBoothStream) {
      this.photoBoothStream.getTracks().forEach(track => track.stop());
      this.photoBoothStream = null;
    }
    this.photoBoothCountdown = null;
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (document.hidden && this.photoBoothStream) this.stopPhotoBoothCamera();
  }

  @HostListener('window:blur')
  onWindowBlur(): void {
    if (this.photoBoothStream) this.stopPhotoBoothCamera();
  }

  setPhotoBoothFilter(filterName: string): void {
    this.photoBoothFilter = filterName;
  }

  takePhotoBoothPicture(): void {
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

  private playPhotoBoothCountdownBeep(): void {
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
      // Audio policy
    }
  }

  private triggerPhotoBoothShutter(): void {
    this.photoBoothFlash = true;
    setTimeout(() => (this.photoBoothFlash = false), 180);

    const videoEl = document.getElementById('photobooth-video') as HTMLVideoElement;
    if (videoEl) {
      const canvas = document.createElement('canvas');
      const w = videoEl.videoWidth || 640;
      const h = videoEl.videoHeight || 480;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.filter = this.getCanvasFilter(this.photoBoothFilter);
        ctx.drawImage(videoEl, 0, 0, w, h);
        ctx.restore();

        ctx.filter = 'none';
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const grad = ctx.createLinearGradient(0, h - 92, 0, h);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, 'rgba(3, 7, 18, 0.96)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, h - 92, w, 92);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px -apple-system, sans-serif';
        ctx.fillText('LEICA M11-P', 22, h - 30);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px monospace';
        ctx.fillText(`SUMMILUX-M 35mm f/1.4  •  ${this.getFilterDisplayName(this.photoBoothFilter).toUpperCase()}`, 22, h - 16);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px -apple-system, sans-serif';
        ctx.fillText('PROSENJIT PAUL', w - 16, h - 30);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '8px monospace';
        ctx.fillText(`macOS Sequoia  •  ${dateStr} ${timeStr}`, w - 16, h - 16);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        this.photoBoothPhotos.unshift(dataUrl);
      }
    }
  }

  getCanvasFilter(filterName: string): string {
    switch (filterName) {
      case 'leica-look': return 'contrast(122%) saturate(125%) brightness(98%)';
      case 'leica-mono': return 'grayscale(100%) contrast(148%) brightness(94%)';
      case 'leica-vivid': return 'saturate(145%) contrast(115%) brightness(102%)';
      case 'mac-noir': return 'grayscale(100%) contrast(165%) brightness(88%)';
      case 'mac-dramatic': return 'sepia(32%) saturate(135%) contrast(118%)';
      case 'mac-cyber': return 'saturate(128%) contrast(122%) hue-rotate(185deg)';
      case 'mac-studio': return 'brightness(110%) contrast(110%) saturate(118%)';
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
      default: return 'Natural';
    }
  }

  deletePhotoBoothPicture(index: number, event: Event): void {
    event.stopPropagation();
    this.photoBoothPhotos.splice(index, 1);
  }

  downloadPhotoBoothPicture(photoUrl: string, event: Event): void {
    event.stopPropagation();
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `photobooth_snap_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
