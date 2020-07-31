import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {GalleryModule} from './gallery/gallery.module';


@NgModule({
  declarations: [],
  imports: [BrowserModule, GalleryModule],
  exports: [BrowserModule, GalleryModule],
})
export class NgxLightboxModule {
}

