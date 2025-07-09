import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero',
  imports: [CommonModule,FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit {

rotatingWords = [
  "Enterprise Web Applications",
  "Interactive User Interfaces",
  "Full-Stack Development",
  "Secure Digital Platforms"
];

  currentWordIndex = 0
  currentWord = this.rotatingWords[0]

  stats = [
    { number: "8", label: "Projects Completed" },
    { number: "2+", label: "Years Experience" },
    // { number: "30+", label: "Happy Clients" },
  ]

  techIcons = [
    { icon: "fab fa-java", color: "#5382a1", position: { top: "20%", right: "-10%" }, delay: "0s" },
    { icon: "fab fa-js-square", color: "#f7df1e", position: { top: "50%", left: "-10%" }, delay: "1s" },
    { icon: "fab fa-angular", color: "#f24e1e", position: { bottom: "30%", right: "-5%" }, delay: "2s" },
    { icon: "fab fa-node", color: "#339933", position: { bottom: "10%", left: "-5%" }, delay: "3s" },
    // { icon: "fab fa-rect", color: "#61dafb", position: { bottom: "0%", left: "-5%" }, delay: "s" },
  ]

  ngOnInit() {
    this.startWordRotation()
  }

  private startWordRotation() {
    setInterval(() => {
      this.currentWordIndex = (this.currentWordIndex + 1) % this.rotatingWords.length
      this.currentWord = this.rotatingWords[this.currentWordIndex]
    }, 2000)
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80
      const targetPosition = element.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  }

}
