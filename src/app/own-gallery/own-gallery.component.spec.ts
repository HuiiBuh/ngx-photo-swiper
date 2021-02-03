import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnGalleryComponent } from './own-gallery.component';

describe('OwnGalleryComponent', () => {
  let component: OwnGalleryComponent;
  let fixture: ComponentFixture<OwnGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
