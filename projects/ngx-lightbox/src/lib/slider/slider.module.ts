import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SliderComponent} from './slider/slider.component';
import { ControlsComponent } from './controls/controls.component';


@NgModule({
  declarations: [SliderComponent, ControlsComponent],
  imports: [
    CommonModule
  ],
  exports: [SliderComponent]
})
export class SliderModule {
}
