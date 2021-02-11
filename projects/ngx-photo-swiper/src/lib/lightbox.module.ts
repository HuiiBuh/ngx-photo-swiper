import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexGalleryComponent } from './components/flex-gallery/flex-gallery.component';
import { LightboxComponent } from './components/lightbox/lightbox.component';
import { SquareGalleryComponent } from './components/square-gallery/square-gallery.component';
import { SliderModule } from './slider/slider.module';
import { LightboxStore } from './store/lightbox.store';

@NgModule({
  declarations: [LightboxComponent, FlexGalleryComponent, SquareGalleryComponent],
  imports: [BrowserModule, SliderModule, BrowserAnimationsModule],
  providers: [LightboxStore],
  exports: [SliderModule, LightboxComponent, FlexGalleryComponent, SquareGalleryComponent],
})
export class LightboxModule {
}
