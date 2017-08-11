import { TestBed, inject } from '@angular/core/testing';

import { DiscussService } from './discuss.service';

describe('DiscussService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiscussService]
    });
  });

  it('should ...', inject([DiscussService], (service: DiscussService) => {
    expect(service).toBeTruthy();
  }));
});
