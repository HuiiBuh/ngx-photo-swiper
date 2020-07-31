import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgxLightboxModule} from '../../projects/ngx-lightbox/src/lib/ngx-lightbox.module';
import {AppComponent} from './app-component/app.component';

import {AppRoutingModule} from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxLightboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
