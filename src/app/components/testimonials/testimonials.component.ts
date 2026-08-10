import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent implements OnInit {


  testimonial = {
    text: "Prosenjit brings a rare mix of design sensitivity and engineering discipline. The final product felt much more mature, more responsive, and more polished than where we started.",
    client: {
      name: "Product Collaboration Highlight",
      position: "Professional feedback style",
      avatar: "/public/assets/images/prosenjit_college.jpg",
    },
    rating: 5,
  }

  constructor() {}
  ngOnInit(): void {
    
  }

  get ratingStars() {
    return Array(this.testimonial.rating).fill(0)
  }

}
