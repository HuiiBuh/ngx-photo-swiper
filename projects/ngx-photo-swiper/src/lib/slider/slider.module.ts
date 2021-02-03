import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ControlsComponent } from './components/controls/controls.component';
import { ShareComponent } from './components/share/share.component';
import { SliderImageComponent } from './components/slider-image/slider-image.component';
import { SliderComponent } from './components/slider/slider.component';
import { PhotoSliderDirective } from './directives/photo-slider.directive';
import { TouchmoveDirective } from './directives/touchmove.directive';

@NgModule({
  declarations: [SliderComponent, ControlsComponent, ShareComponent, TouchmoveDirective, SliderImageComponent, PhotoSliderDirective],
  imports: [
    CommonModule,
  ],
  exports: [ControlsComponent, SliderComponent],
})
export class SliderModule {
}
