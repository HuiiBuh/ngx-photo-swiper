import {NgModule} from '@angular/core';
import {LightboxImageComponent} from './lightbox-image/lightbox-image.component';
import {LightboxWrapperComponent} from './main-component/lightbox-wrapper.component';


@NgModule({
  declarations: [LightboxWrapperComponent, LightboxImageComponent],
  imports: [],
  exports: [LightboxWrapperComponent, LightboxImageComponent],
})
export class NgxLightboxModule {
}
