import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let compiled: HTMLElement;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;

    // Provide mock data
    component.personalDetails = [
      { label: 'Name', value: 'Prosenjit' },
      { label: 'Experience', value: '5 years' }
    ];

    component.socialLinks = [
      { url: 'https://github.com/prosenjit', icon: 'fab fa-github' },
      { url: 'https://linkedin.com/in/prosenjit', icon: 'fab fa-linkedin' }
    ];
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display section title', () => {
    const title = compiled.querySelector('.section-title');
    expect(title?.textContent).toContain('Passionate Developer & Designer');
  });

  it('should render personal details', () => {
    const details = compiled.querySelectorAll('.detail-item');
    expect(details.length).toBe(2);
    expect(details[0].textContent).toContain('Name');
    expect(details[0].textContent).toContain('Prosenjit');
  });

  it('should render social links', () => {
    const links = compiled.querySelectorAll('.social-link');
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('https://github.com/prosenjit');
  });

  it('should show download CV button', () => {
    const btn = compiled.querySelector('.btn.btn-primary');
    expect(btn?.textContent).toContain('Download CV');
  });
  it('should show badge number as 5+', () => {
    const badge = compiled.querySelector('.badge-number');
    expect(badge?.textContent?.trim()).toBe('5+');
  });


});
