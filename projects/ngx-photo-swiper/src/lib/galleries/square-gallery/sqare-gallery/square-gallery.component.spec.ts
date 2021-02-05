import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuqareGalleryComponent } from './square-gallery.component';

describe('SqareGalleryComponent', () => {
  let component: SuqareGalleryComponent;
  let fixture: ComponentFixture<SuqareGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuqareGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuqareGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
