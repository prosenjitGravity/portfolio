import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {

  private http = inject(HttpClient);
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
    { icon: "fab fa-linkedin-in", url: "https://www.linkedin.com/in/prosenjit-paul-0a82b6239" },
    { icon: "fab fa-github", url: "https://github.com/prosenjitGravity?tab=repositories" },
    { icon: "fab fa-twitter", url: "#" },
    { icon: "fab fa-dribbble", url: "#" },
  ]

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
     name: ['',[Validators.required,Validators.minLength(3),Validators.pattern(/^[A-Za-z\s]+$/) ]
    ],
    email: ['',
      [Validators.required,Validators.email,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
    ],
    subject: ['',
      [Validators.required,Validators.minLength(5),Validators.pattern(/^[A-Za-z0-9\s.,!?'-]{5,}$/)]
    ],
    message: ['',]
  })
  }

  ngOnInit(): void {
    
  }

  onSubmit() {
  if (this.contactForm.valid) {
    this.isSubmitting = true;

    const { name, email, subject, message } = this.contactForm.value;

    // Step 1: Get IP address
    this.http.get<any>('https://ipapi.co/json').subscribe({
      next: (ipResponse) => {

        console.log('IP Address:', ipResponse); // Log the IP address for debugging
        
        const userIp = ipResponse.ip;


        // Step 2: Prepare the email content
        const templateParams = {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
          user_ip: userIp, // 🔥 Include this in the template
        };

        // Step 3: Send email via EmailJS
        // emailjs
        //   .send('your_service_id', 'your_template_id', templateParams, 'your_public_key')
        //   .then(
        //     () => {
        //       this.isSubmitting = false;
        //       this.isSubmitted = true;
        //       this.contactForm.reset();

        //       setTimeout(() => (this.isSubmitted = false), 3000);
        //     },
        //     (error) => {
        //       console.error('Email sending failed:', error);
        //       this.isSubmitting = false;
        //     }
        //   );
      },
      error: () => {
        this.isSubmitting = false;
        alert('Could not fetch IP address.');
      },
    });
  } else {
    Object.keys(this.contactForm.controls).forEach((key) =>
      this.contactForm.get(key)?.markAsTouched()
    );
  }
}

  getFieldError(field: string): string | null {
    const control = this.contactForm.get(field);
    if (control && control.touched && control.errors) {
      if (control.errors['required']) return `${this.formatFieldName(field)} is required.`;
      if (control.errors['minlength']) return `${this.formatFieldName(field)} must be at least ${control.errors['minlength'].requiredLength} characters.`;
      if (control.errors['email']) return `Please enter a valid email address.`;
      if (control.errors['pattern']) return `Invalid ${this.formatFieldName(field)} format.`;
    }
    return null;
  }

  formatFieldName(field: string): string {
    return field.charAt(0).toUpperCase() + field.slice(1);
  }


}
