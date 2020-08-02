import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {GalleryModule} from './gallery/gallery.module';
import {SliderModule} from './slider/slider.module';
import {LightboxStore} from './store/lightbox.store';


@NgModule({
  declarations: [],
  imports: [BrowserModule, GalleryModule, SliderModule],
  providers: [LightboxStore],
  exports: [GalleryModule, SliderModule],
})
export class NgxLightboxModule {
}

