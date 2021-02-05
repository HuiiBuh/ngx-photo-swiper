import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexGalleryComponent } from './flex-gallery.component';

describe('GalleryComponent', () => {
  let component: FlexGalleryComponent;
  let fixture: ComponentFixture<FlexGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlexGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
