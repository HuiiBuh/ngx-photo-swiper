import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LightboxModule } from '../../projects/ngx-photo-swiper/src/lib/lightbox.module';
import { AppComponent } from './app-component/app.component';

import { AppRoutingModule } from './app-routing.module';
import { GalleryComponent } from './gallery/gallery.component';
import { OwnGalleryComponent } from './own-gallery/own-gallery.component';

@NgModule({
  declarations: [
    AppComponent,
    GalleryComponent,
    OwnGalleryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LightboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
