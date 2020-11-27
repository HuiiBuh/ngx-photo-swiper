import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SliderModule } from '../slider/slider.module';
import { NgxGalleryComponent } from './gallery-component/ngx-gallery.component';


@NgModule({
  declarations: [NgxGalleryComponent],
  imports: [
    CommonModule,
    SliderModule,
  ],
  exports: [NgxGalleryComponent],
})
export class GalleryModule {
}
