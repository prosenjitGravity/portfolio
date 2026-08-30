import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  @Input() isMacWindow = false;
  contactForm: FormGroup;
  isSubmitting = false;
  isSubmitted = false;

  contactDetails = [
    {
      icon: 'fas fa-envelope',
      label: 'Email',
      value: 'paul.prosenjitbit@gmail.com'
    },
    {
      icon: 'fas fa-map-marker-alt',
      label: 'Location',
      value: 'Kolkata, West Bengal, India'
    }
  ];

  socialLinks = [
    { icon: 'fab fa-linkedin-in', url: 'https://www.linkedin.com/in/prosenjit-paul-0a82b6239' },
    { icon: 'fab fa-github', url: 'https://github.com/prosenjitGravity?tab=repositories' },
    { icon: 'fas fa-file-alt', url: '/public/assets/files/Prosenjit_Resume.pdf' }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z\s]+$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      subject: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[A-Za-z0-9\s.,!?'-]{5,}$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.contactForm.valid) {
      const { name, email, subject, message } = this.contactForm.value;
      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      window.location.href = `mailto:paul.prosenjitbit@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      this.isSubmitted = true;
      setTimeout(() => this.isSubmitted = false, 4000);

      return;
    }

    Object.keys(this.contactForm.controls).forEach((key) =>
      this.contactForm.get(key)?.markAsTouched()
    );
  }

  startInquiry(subject: string) {
    this.contactForm.patchValue({ subject });
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  getFieldError(field: string): string | null {
    const control = this.contactForm.get(field);
    if (control && control.touched && control.errors) {
      if (control.errors['required']) return `${this.formatFieldName(field)} is required.`;
      if (control.errors['minlength']) return `${this.formatFieldName(field)} must be at least ${control.errors['minlength'].requiredLength} characters.`;
      if (control.errors['email']) return 'Please enter a valid email address.';
      if (control.errors['pattern']) return `Invalid ${this.formatFieldName(field)} format.`;
    }

    return null;
  }

  formatFieldName(field: string): string {
    return field.charAt(0).toUpperCase() + field.slice(1);
  }
}
