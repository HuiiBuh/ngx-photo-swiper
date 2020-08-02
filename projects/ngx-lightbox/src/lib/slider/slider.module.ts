import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SliderComponent} from './slider/slider.component';


@NgModule({
  declarations: [SliderComponent],
  imports: [
    CommonModule
  ],
  exports: [SliderComponent]
})
export class SliderModule {
}
