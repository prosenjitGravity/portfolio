import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CelebrationData, CelebrationModalService } from '../../../services/celebration-modal.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';



interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  life: number
  type: "circle" | "star" | "diamond" | "sparkle"
  rotation: number
  rotationSpeed: number
  gravity: number
  bounce: number
}

interface FloatingShape {
  id: number
  x: number
  y: number
  size: number
  color: string
  speed: number
  direction: number
  opacity: number
  type: "bubble" | "ring" | "hex"
}

interface Ripple {
  id: number
  x: number
  y: number
  time: number
}


@Component({
  selector: 'app-celebration-modal',
  imports: [CommonModule],
  templateUrl: './celebration-modal.component.html',
  styleUrl: './celebration-modal.component.scss',
  animations: [
    trigger("modalAnimation", [
      state(
        "closed",
        style({
          opacity: 0,
          transform: "scale(0.8)",
        }),
      ),
      state(
        "open",
        style({
          opacity: 1,
          transform: "scale(1)",
        }),
      ),
      transition("closed => open", [animate("500ms ease-out")]),
      transition("open => closed", [animate("300ms ease-in")]),
    ]),
    trigger("contentAnimation", [
      state(
        "hidden",
        style({
          opacity: 0,
          transform: "scale(0.5) translateY(50px) rotate(12deg)",
        }),
      ),
      state(
        "visible",
        style({
          opacity: 1,
          transform: "scale(1) translateY(0) rotate(0deg)",
        }),
      ),
      transition("hidden => visible", [animate("700ms 300ms ease-out")]),
    ]),
  ],
})
export class CelebrationModalComponent implements OnInit,OnDestroy {

  //services
  private celebrationService = inject(CelebrationModalService);

  celebrationData: CelebrationData = { amount: 0, message: "", isVisible: false }
  particles: Particle[] = []
  floatingShapes: FloatingShape[] = []
  ripples: Ripple[] = []
  showContent = false

  private subscription: Subscription = new Subscription()
  private animationInterval: any
  private colors = [
    "#FFD700",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#FF9FF3",
    "#54A0FF",
    "#5F27CD",
    "#00D2D3",
    "#FF9F43",
    "#10AC84",
    "#EE5A24",
  ];
  Math = Math



  constructor() { }


  ngOnInit(): void {
    this.subscription.add(
      this.celebrationService.celebration$.subscribe((data) => {
        this.celebrationData = data
        if (data.isVisible) {
          this.startCelebration()
        } else {
          this.stopCelebration()
        }
      }),
    );
    
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    if (this.animationInterval) {
      clearInterval(this.animationInterval)
    }
  }
  private startCelebration(): void {
    this.createParticles()
    this.createFloatingShapes()
    this.showContent = false

    setTimeout(() => {
      this.showContent = true
    }, 100)

    // Create ripples
    setTimeout(() => this.createRipple(window.innerWidth / 2, window.innerHeight / 2), 500)
    setTimeout(() => this.createRipple(window.innerWidth * 0.3, window.innerHeight * 0.3), 800)
    setTimeout(() => this.createRipple(window.innerWidth * 0.7, window.innerHeight * 0.7), 1100)

    this.animationInterval = setInterval(() => {
      this.updateParticles()
      this.updateFloatingShapes()
      this.updateRipples()
    }, 16)

    setTimeout(() => {
      this.stopCelebration()
    }, 8000)
  }

  private stopCelebration(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval)
    }
    this.particles = []
    this.floatingShapes = []
    this.ripples = []
    // this.closeCelebration();
    
    // this.showContent = false 
  }

  private createParticles(): void {
    const particleTypes: Array<"circle"  | "diamond" | "sparkle"> = ["circle", "diamond", "sparkle"]

    for (let i = 0; i < 80; i++) {
      this.particles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 4 + 1,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        size: Math.random() * 12 + 6,
        life: 1,
        type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: Math.random() * 0.3 + 0.1,
        bounce: Math.random() * 0.8 + 0.2,
      })
    }
  }

  private createFloatingShapes(): void {
    const shapeTypes: Array<"bubble" | "ring" | "hex"> = ["bubble", "ring", "hex"]

    for (let i = 0; i < 15; i++) {
      this.floatingShapes.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 60 + 20,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        speed: Math.random() * 2 + 0.5,
        direction: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.3 + 0.1,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
      })
    }
  }

  private createRipple(x: number, y: number): void {
    this.ripples.push({
      id: Date.now() + Math.random(),
      x,
      y,
      time: 0,
    })
  }

  private updateParticles(): void {
    this.particles = this.particles
      .map((particle) => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + particle.gravity,
        rotation: particle.rotation + particle.rotationSpeed,
        life: particle.life - 0.008,
        ...(particle.y > window.innerHeight - 50 && particle.vy > 0
          ? { vy: -particle.vy * particle.bounce, y: window.innerHeight - 50 }
          : {}),
      }))
      .filter((particle) => particle.life > 0 && particle.x > -50 && particle.x < window.innerWidth + 50)
  }

  private updateFloatingShapes(): void {
    this.floatingShapes = this.floatingShapes.map((shape) => {
      let newX = shape.x + Math.cos(shape.direction) * shape.speed
      let newY = shape.y + Math.sin(shape.direction) * shape.speed

      // Wrap around screen
      if (newX > window.innerWidth + 50) newX = -50
      if (newX < -50) newX = window.innerWidth + 50
      if (newY > window.innerHeight + 50) newY = -50
      if (newY < -50) newY = window.innerHeight + 50

      return {
        ...shape,
        x: newX,
        y: newY,
        direction: shape.direction + 0.01,
      }
    })
  }

  private updateRipples(): void {
    this.ripples = this.ripples
      .map((ripple) => ({ ...ripple, time: ripple.time + 1 }))
      .filter((ripple) => ripple.time < 100)
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  getParticleIcon(type: string): string {
    const icons = {
      circle: "●",
      star: "⭐",
      diamond: "💎",
      sparkle: "✨",
    }
    return icons[type as keyof typeof icons] || "●"
  }

  getShapeBackground(shape: FloatingShape): string {
    switch (shape.type) {
      case "bubble":
        return `radial-gradient(circle at 30% 30%, ${shape.color}20, transparent)`
      case "hex":
        return shape.color
      default:
        return "transparent"
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeCelebration()
    }
  }

  closeCelebration(): void {
    this.celebrationService.hideCelebration()
  }

  // Expose Math for template

}
