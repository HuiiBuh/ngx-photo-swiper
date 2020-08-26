import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SliderComponent} from './slider/slider.component';
import { ControlsComponent } from './controls/controls.component';
import { ShareComponent } from './share/share.component';


@NgModule({
  declarations: [SliderComponent, ControlsComponent, ShareComponent],
  imports: [
    CommonModule
  ],
  exports: [SliderComponent, ControlsComponent]
})
export class SliderModule {
}
