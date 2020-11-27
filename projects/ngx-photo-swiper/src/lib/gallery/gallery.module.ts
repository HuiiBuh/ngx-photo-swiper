import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SliderModule } from '../slider/slider.module';
import { GalleryComponent } from './gallery-component/gallery.component';


@NgModule({
  declarations: [GalleryComponent],
  imports: [
    CommonModule,
    SliderModule,
  ],
  exports: [GalleryComponent],
})
export class GalleryModule {
}
