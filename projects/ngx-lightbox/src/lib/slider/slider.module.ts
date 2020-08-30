import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ControlsComponent} from './controls/controls.component';
import {ShareComponent} from './share/share.component';
import {SliderComponent} from './slider/slider.component';
import { TouchmoveDirective } from './slider/touchmove.directive';


@NgModule({
  declarations: [SliderComponent, ControlsComponent, ShareComponent, TouchmoveDirective],
  imports: [
    CommonModule,
  ],
  exports: [SliderComponent, ControlsComponent],
})
export class SliderModule {
}
