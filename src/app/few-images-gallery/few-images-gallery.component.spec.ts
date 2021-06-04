import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FewImagesGalleryComponent } from './few-images-gallery.component';

describe('GalleryComponent', () => {
  let component: FewImagesGalleryComponent;
  let fixture: ComponentFixture<FewImagesGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FewImagesGalleryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FewImagesGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
