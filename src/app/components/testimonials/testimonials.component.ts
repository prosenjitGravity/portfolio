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
    text: "Prosenjit delivered exceptional work that exceeded our expectations. His attention to detail and technical expertise made our project a huge success. Highly recommended!",
    client: {
      name: "Sarah Johnson",
      position: "CEO, TechStart Inc.",
      avatar: "https://via.placeholder.com/80x80",
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
