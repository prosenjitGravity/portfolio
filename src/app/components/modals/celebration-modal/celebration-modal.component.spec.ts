import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebrationModalComponent } from './celebration-modal.component';

describe('CelebrationModalComponent', () => {
  let component: CelebrationModalComponent;
  let fixture: ComponentFixture<CelebrationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CelebrationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CelebrationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
