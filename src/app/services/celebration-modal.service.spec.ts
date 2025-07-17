import { TestBed } from '@angular/core/testing';

import { CelebrationModalService } from './celebration-modal.service';

describe('CelebrationModalService', () => {
  let service: CelebrationModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CelebrationModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
