import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {GalleryModule} from './gallery/gallery.module';
import {LightboxState} from './lightbox.state';


@NgModule({
  declarations: [],
  imports: [BrowserModule, GalleryModule],
  providers: [LightboxState],
  exports: [BrowserModule, GalleryModule],
})
export class NgxLightboxModule {
}

