import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LightboxModule } from '../../projects/ngx-photo-swiper/src/lib/lightbox.module';
import { AppComponent } from './app-component/app.component';

import { AppRoutingModule } from './app-routing.module';
import { CustomGalleryComponent } from './custom-gallery/custom-gallery.component';
import { FewImagesGalleryComponent } from './few-images-gallery/few-images-gallery.component';
import { FlexGalleryComponent } from './flex-gallery/flex-gallery.component';
import { SquareGalleryComponent } from './sqare-gallery/square-gallery.component';

@NgModule({
  declarations: [
    AppComponent,
    FlexGalleryComponent,
    SquareGalleryComponent,
    CustomGalleryComponent,
    FewImagesGalleryComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    LightboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
