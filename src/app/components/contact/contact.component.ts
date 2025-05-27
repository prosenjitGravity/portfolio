import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup
  isSubmitting = false
  isSubmitted = false

  contactDetails = [
    {
      icon: "fas fa-envelope",
      label: "Email",
      value: "paul.prosenjitbit@gmail.com",
    },
    {
      icon: "fas fa-phone",
      label: "Phone",
      value: "+91 9933764053",
    },
    {
      icon: "fas fa-map-marker-alt",
      label: "Location",
      value: "Kolkata, India",
    },
  ]

  socialLinks = [
    { icon: "fab fa-linkedin-in", url: "www.linkedin.com/in/prosenjit-paul-0a82b6239" },
    { icon: "fab fa-github", url: "https://github.com/prosenjitGravity?tab=repositories" },
    { icon: "fab fa-twitter", url: "#" },
    { icon: "fab fa-dribbble", url: "#" },
  ]

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      subject: ["", [Validators.required, Validators.minLength(5)]],
      message: ["", [Validators.required, Validators.minLength(10)]],
    })
  }

  ngOnInit(): void {
    
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true

      // Simulate form submission
      setTimeout(() => {
        this.isSubmitting = false
        this.isSubmitted = true
        this.contactForm.reset()

        // Reset success message after 3 seconds
        setTimeout(() => {
          this.isSubmitted = false
        }, 3000)
      }, 2000)

      console.log("Form submitted:", this.contactForm.value)
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.get(key)?.markAsTouched()
      })
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName)
    if (field?.errors && field.touched) {
      if (field.errors["required"]) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
      }
      if (field.errors["email"]) {
        return "Please enter a valid email address"
      }
      if (field.errors["minlength"]) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is too short`
      }
    }
    return ""
  }

}
