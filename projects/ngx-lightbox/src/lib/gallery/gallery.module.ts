import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgxLightboxComponent} from './main-component/ngx-lightbox.component';


@NgModule({
  declarations: [NgxLightboxComponent],
  imports: [
    CommonModule
  ],
  exports: [NgxLightboxComponent]
})
export class GalleryModule {
}
