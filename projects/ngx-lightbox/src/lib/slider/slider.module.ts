import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ControlsComponent} from './controls/controls.component';
import {SliderComponent} from './slider/slider.component';
import { HotkeyListenerComponent } from './hotkey-listener/hotkey-listener.component';
import { ShareComponent } from './share/share.component';


@NgModule({
  declarations: [SliderComponent, ControlsComponent, HotkeyListenerComponent, ShareComponent],
  imports: [
    CommonModule,
  ],
  exports: [SliderComponent, ControlsComponent],
})
export class SliderModule {
}
