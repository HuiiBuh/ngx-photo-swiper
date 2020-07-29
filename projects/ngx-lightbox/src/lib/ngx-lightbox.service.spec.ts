import { TestBed } from '@angular/core/testing';

import { NgxLightboxService } from './ngx-lightbox.service';

describe('NgxLightboxService', () => {
  let service: NgxLightboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxLightboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
