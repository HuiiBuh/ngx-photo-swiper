import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexGalleryModule } from './galleries/flex-gallery/flex-gallery.module';
import { SquareGalleryModule } from './galleries/square-gallery/square-gallery.module';
import { LightboxComponent } from './lightbox-component/lightbox.component';
import { SliderModule } from './slider/slider.module';
import { LightboxStore } from './store/lightbox.store';

@NgModule({
  declarations: [LightboxComponent],
  imports: [BrowserModule, FlexGalleryModule, SquareGalleryModule, SliderModule, BrowserAnimationsModule],
  providers: [LightboxStore],
  exports: [SliderModule, LightboxComponent],
})
export class LightboxModule {
}
