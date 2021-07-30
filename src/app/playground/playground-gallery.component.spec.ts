import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaygroundGalleryComponent } from './playground-gallery.component';

describe('GalleryComponent', () => {
  let component: PlaygroundGalleryComponent;
  let fixture: ComponentFixture<PlaygroundGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaygroundGalleryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaygroundGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
