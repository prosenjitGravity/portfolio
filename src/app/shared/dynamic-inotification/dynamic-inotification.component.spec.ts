import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicInotificationComponent } from './dynamic-inotification.component';

describe('DynamicInotificationComponent', () => {
  let component: DynamicInotificationComponent;
  let fixture: ComponentFixture<DynamicInotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicInotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicInotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
