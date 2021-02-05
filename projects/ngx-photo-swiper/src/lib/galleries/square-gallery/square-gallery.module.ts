import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SquareGalleryComponent } from './sqare-gallery/square-gallery.component';

@NgModule({
  declarations: [SquareGalleryComponent],
  imports: [
    CommonModule,
  ],
  exports: [SquareGalleryComponent],
})
export class SquareGalleryModule {
}
