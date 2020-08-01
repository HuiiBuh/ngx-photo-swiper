import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgxGalleryComponent} from './gallery-component/ngx-gallery.component';


@NgModule({
  declarations: [NgxGalleryComponent],
  imports: [
    CommonModule
  ],
  exports: [NgxGalleryComponent]
})
export class GalleryModule {
}
