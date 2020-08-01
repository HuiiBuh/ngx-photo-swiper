import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {GalleryModule} from './gallery/gallery.module';
import {LightboxStore} from './store/lightbox.store';


@NgModule({
  declarations: [],
  imports: [BrowserModule, GalleryModule],
  providers: [LightboxStore],
  exports: [BrowserModule, GalleryModule],
})
export class NgxLightboxModule {
}

