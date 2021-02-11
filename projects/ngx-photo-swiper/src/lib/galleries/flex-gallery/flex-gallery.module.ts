import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SliderModule } from '../../slider/slider.module';
import { FlexGalleryComponent } from './flex-gallery/flex-gallery.component';

@NgModule({
  declarations: [FlexGalleryComponent],
  imports: [
    CommonModule,
    SliderModule
  ],
  exports: [FlexGalleryComponent],
})
export class FlexGalleryModule {
}
