import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {LightboxModule} from '../../projects/ngx-photo-swiper/src/lib/lightbox.module';
import {AppComponent} from './app-component/app.component';

import {AppRoutingModule} from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LightboxModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}


