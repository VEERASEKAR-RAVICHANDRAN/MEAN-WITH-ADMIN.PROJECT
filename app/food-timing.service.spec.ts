import { TestBed } from '@angular/core/testing';

import { FoodTimingService } from './food-timing.service';

describe('FoodTimingService', () => {
  let service: FoodTimingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodTimingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
