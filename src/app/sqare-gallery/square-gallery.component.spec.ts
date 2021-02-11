import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareGalleryComponent } from './square-gallery.component';

describe('SqareGalleryComponent', () => {
  let component: SquareGalleryComponent;
  let fixture: ComponentFixture<SquareGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquareGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
