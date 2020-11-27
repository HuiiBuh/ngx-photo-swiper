import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GalleryModule } from './gallery/gallery.module';
import { SliderModule } from './slider/slider.module';
import { LightboxStore } from './store/lightbox.store';


@NgModule({
  declarations: [],
  imports: [BrowserModule, GalleryModule, SliderModule, BrowserAnimationsModule],
  providers: [LightboxStore],
  exports: [GalleryModule, SliderModule],
})
export class NgxLightboxModule {
}

