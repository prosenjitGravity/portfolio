import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent  implements OnInit{

  services = [
    {
      icon: "fas fa-code",
      title: "Web Development",
      description:
        "Building responsive, fast, and scalable web applications using modern technologies and best practices.",
      technologies: ["React", "Node.js", "TypeScript"],
    },
    {
      icon: "fas fa-palette",
      title: "UI/UX Design",
      description:
        "Creating intuitive and engaging user interfaces that provide exceptional user experiences across all devices.",
      technologies: ["Figma", "Adobe XD", "Sketch"],
    },
    {
      icon: "fas fa-mobile-alt",
      title: "Mobile Development",
      description:
        "Developing cross-platform mobile applications that deliver native-like performance and user experience.",
      technologies: ["React Native", "Flutter", "Swift"],
    },
  ]

  constructor(){}

  ngOnInit(): void {
    
  }

}
