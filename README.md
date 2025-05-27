# Prosenjit Paul - Professional Portfolio

A modern, responsive portfolio website built with Angular, showcasing professional web development and UI/UX design services. This portfolio features cutting-edge animations, interactive components, and a clean, professional design that adapts seamlessly across all devices.

## 🚀 Live Demo

[View Live Portfolio](https://your-portfolio-url.com)

## ✨ Features

### 🎨 Design & User Experience
- **Modern UI/UX Design** - Clean, professional interface with intuitive navigation
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Engaging CSS animations and transitions
- **Interactive Elements** - Hover effects, floating icons, and dynamic content
- **Professional Typography** - Inter font family for optimal readability

### 🛠️ Technical Highlights
- **Angular Framework** - Built with Angular 15+ for robust performance
- **TypeScript** - Type-safe development with enhanced code quality
- **Component Architecture** - Modular, reusable components for maintainability
- **Reactive Forms** - Professional form handling with real-time validation
- **SCSS Styling** - Advanced styling with CSS custom properties
- **Performance Optimized** - Fast loading times and smooth interactions

### 📱 Responsive Features
- **Mobile-First Design** - Optimized for mobile devices
- **Flexible Grid System** - CSS Grid and Flexbox layouts
- **Adaptive Navigation** - Mobile-friendly hamburger menu
- **Touch-Friendly** - Optimized for touch interactions

### 🎯 Portfolio Sections
- **Hero Section** - Dynamic introduction with sliding text animation
- **About** - Professional background and personal details
- **Services** - Comprehensive service offerings
- **Portfolio** - Filterable project showcase
- **Testimonials** - Client feedback and reviews
- **Contact** - Professional contact form with validation

## 🛠️ Technologies Used

### Frontend Framework
- **Angular 15+** - Modern web application framework
- **TypeScript** - Strongly typed programming language
- **RxJS** - Reactive programming with observables

### Styling & Design
- **SCSS** - Advanced CSS preprocessing
- **CSS Grid & Flexbox** - Modern layout systems
- **CSS Custom Properties** - Dynamic theming support
- **Font Awesome** - Professional icon library
- **Google Fonts** - Inter font family

### Development Tools
- **Angular CLI** - Command-line interface for Angular
- **Node.js** - JavaScript runtime environment
- **npm** - Package manager

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Angular CLI (v15 or higher)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/prosenjitpaul/portfolio.git
   cd portfolio
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Install Angular CLI globally** (if not already installed)
   \`\`\`bash
   npm install -g @angular/cli
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   ng serve
   \`\`\`

5. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

\`\`\`bash
# Build the project
ng build --prod

# The build artifacts will be stored in the `dist/` directory
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── app/
│   ├── components/
│   │   ├── header/
│   │   ├── hero/
│   │   ├── about/
│   │   ├── services/
│   │   ├── portfolio/
│   │   ├── testimonials/
│   │   ├── contact/
│   │   ├── footer/
│   │   └── preloader/
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.scss
│   └── app.module.ts
├── assets/
├── styles.scss
└── index.html
\`\`\`

## 🎨 Customization

### Color Scheme
The portfolio uses CSS custom properties for easy theming. Update the color variables in `styles.scss`:

\`\`\`scss
:root {
  --primary-color: #6366f1;
  --secondary-color: #f59e0b;
  --accent-color: #ec4899;
  // ... other colors
}
\`\`\`

### Content Updates
- **Personal Information**: Update `about.component.ts` and `contact.component.ts`
- **Projects**: Modify the projects array in `portfolio.component.ts`
- **Services**: Update the services array in `services.component.ts`
- **Social Links**: Update social media links in respective components

### Images
Replace placeholder images with your own:
- Profile images: Update image URLs in hero and about components
- Project images: Update project image URLs in portfolio component

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Performance Optimizations

- **Lazy Loading** - Components loaded on demand
- **Optimized Images** - Compressed and responsive images
- **Minified Assets** - CSS and JavaScript minification
- **Tree Shaking** - Unused code elimination
- **AOT Compilation** - Ahead-of-time compilation for faster rendering

## 📈 SEO Features

- **Meta Tags** - Proper meta descriptions and keywords
- **Semantic HTML** - Structured markup for better accessibility
- **Open Graph** - Social media sharing optimization
- **Schema Markup** - Structured data for search engines

## ♿ Accessibility

- **WCAG 2.1 Compliant** - Meets accessibility standards
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Support** - Proper ARIA labels and roles
- **Color Contrast** - High contrast ratios for readability

## 🚀 Deployment

### Vercel (Recommended)
\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

### Netlify
\`\`\`bash
npm run build
# Upload dist/ folder to Netlify
\`\`\`

### GitHub Pages
\`\`\`bash
ng add angular-cli-ghpages
ng deploy --base-href=/portfolio/
\`\`\`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/prosenjitpaul/portfolio/issues).

## 📞 Contact

**Prosenjit Paul**
- Website: [prosenjitpaul.com](https://prosenjitpaul.com)
- Email: paul.prosenjitbit@gmail.com
- LinkedIn: [linkedin.com/in/prosenjitpaul](www.linkedin.com/in/prosenjit-paul-0a82b6239)
- GitHub: [github.com/prosenjitpaul](https://github.com/prosenjitGravity?tab=repositories)

## 🙏 Acknowledgments

- [Angular Team](https://angular.io/) for the amazing framework
- [Font Awesome](https://fontawesome.com/) for the icon library
- [Google Fonts](https://fonts.google.com/) for the typography
- Design inspiration from modern portfolio trends

---

⭐ **Star this repository if you found it helpful!**

*Built with ❤️ by Prosenjit Paul*
