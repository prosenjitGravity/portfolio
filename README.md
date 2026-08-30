# Prosenjit Paul • Interactive Portfolio & macOS Workspace

A high-performance personal portfolio and interactive macOS-inspired desktop operating environment built with **Angular 19**, **TypeScript**, and **Modular SCSS**.

---

## 🌟 Overview

This application delivers a dual-experience portfolio:
1. **macOS Desktop Workspace (Interactive Mode):** An authentic macOS Sequoia simulation featuring draggable & resizable glassmorphic windows, dock animations, active window managers, live shell terminal emulator, and an optical Leica & Mac camera photo booth.
2. **Classic View (Scrolling Mode):** A streamlined, responsive layout designed for recruiters, mobile devices, and fast technical reviews.

---

## 🛠️ Architecture & Tech Stack

### Core Technologies
* **Framework:** Angular 19 (Standalone Component Architecture)
* **Language:** TypeScript 5.6+
* **Reactive Core:** RxJS & Angular Signals
* **Styling & Theming:** Custom Modular SCSS, CSS Custom Properties, Glassmorphism Filters
* **Icons:** FontAwesome Pro 6.7
* **Testing & CI:** Karma, Jasmine, Playwright E2E

### Key Application Features
* 🖥️ **macOS Window Management:** Multi-window layering (`zIndex` management), minimize, maximize, resize, and custom titlebar drag handlers.
* 📷 **Photo Booth & Leica Filter Suite:** Real-time WebRTC camera feed with authentic Leica color science (Leica Look, M-Monochrom, Vivid), Apple Studio Noir, live HUD camera badges, and canvas watermark stamping with EXIF metadata, client IP, and GPS telemetry.
* 💻 **Interactive Developer Terminal:** Interactive command execution (`help`, `skills`, `exp`, `projects`, `contact`, `clear`, `matrix`, `neofetch`).
* 🔒 **Security-First Architecture:** Centralized credential management, environment-isolated configurations, and strict adherence to data protection standards.
* 📱 **Dual Responsive System:** Seamless fallback from desktop glassmorphism to touch-optimized mobile layouts.

---

## 📁 Repository Structure

```text
portfolio/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/              # macOS Desktop & Window Manager
│   │   │   ├── about/             # Developer Biography & Stack
│   │   │   ├── experience/        # Professional Work History
│   │   │   ├── portfolio/         # Projects & Architecture Showcase
│   │   │   ├── services/          # Solutions & Capabilities
│   │   │   ├── contact/           # Direct Messaging & Contact Form
│   │   │   ├── topbar/            # macOS Menu Bar & Status Center
│   │   │   └── page-not-found/    # Glassmorphic 404 Error Screen
│   │   ├── config/                # Centralized Security & Credential Templates
│   │   └── services/              # Logger, API & State Services
│   ├── environment/               # Environment-specific Configurations
│   └── styles.scss                # Global Design Tokens & Glassmorphism Utilities
├── .gitignore
├── angular.json
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher
* **Angular CLI:** `npm install -g @angular/cli@19`

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/prosenjitGravity/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   ng serve
   ```
   Open `http://localhost:4200` in your browser.

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## 🛡️ Legal Notice, Intellectual Property & IT Act Compliance

### 1. Proprietary Rights & Copyright
© **2024–Present Prosenjit Paul. All Rights Reserved.**

All source code, creative UI/UX designs, layouts, graphic assets, and architectural implementations contained in this repository are the proprietary intellectual property of **Prosenjit Paul**.
* Unauthorized copying, distribution, modification, public display, or commercial exploitation of this codebase without explicit written permission is strictly prohibited.
* This project is private/proprietary and is **not** licensed under the MIT or any open-source license unless explicitly agreed upon in writing.

### 2. Compliance with Indian Information Technology Act, 2000 (IT Act)
This application complies with the applicable provisions of the **Information Technology Act, 2000 (IT Act)** and the **Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011**:
* **Data Privacy (Section 43A & Section 72A):** Any inquiries, contact form communications, or telemetry processed through this portfolio are handled securely and used solely for professional recruitment and communication.
* **Fair Use & Trademarks:** Apple, macOS, Sequoia, and related marks are trademarks of Apple Inc. Leica is a trademark of Leica Camera AG. All referenced third-party brands and company trademarks belong to their respective owners.

---

## 📬 Contact & Profiles

* **Developer:** Prosenjit Paul (Full Stack Developer)
* **Location:** Kolkata, West Bengal, India
* **Email:** [paul.prosenjitbit@gmail.com](mailto:paul.prosenjitbit@gmail.com)
* **GitHub:** [prosenjitGravity](https://github.com/prosenjitGravity)
* **LinkedIn:** [Prosenjit Paul](https://www.linkedin.com/in/prosenjit-paul-0a82b6239)
* **LeetCode:** [prosenjitGravity](https://leetcode.com/u/prosenjitGravity)
