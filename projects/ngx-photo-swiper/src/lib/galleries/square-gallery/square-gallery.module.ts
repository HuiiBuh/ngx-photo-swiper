import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SliderModule } from '../../slider/slider.module';
import { SquareGalleryComponent } from './sqare-gallery/square-gallery.component';

@NgModule({
  declarations: [SquareGalleryComponent],
    imports: [
        CommonModule,
        SliderModule,
    ],
  exports: [SquareGalleryComponent],
})
export class SquareGalleryModule {
}
