import { TestBed, inject } from '@angular/core/testing';

import { ContentGuardService } from './content-guard.service';

describe('ContentGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentGuardService]
    });
  });

  it('should ...', inject([ContentGuardService], (service: ContentGuardService) => {
    expect(service).toBeTruthy();
  }));
});
