import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexGalleryComponent } from './flex-gallery/flex-gallery.component';

@NgModule({
  declarations: [FlexGalleryComponent],
  imports: [
    CommonModule,
  ],
  exports: [FlexGalleryComponent],
})
export class FlexGalleryModule {
}
