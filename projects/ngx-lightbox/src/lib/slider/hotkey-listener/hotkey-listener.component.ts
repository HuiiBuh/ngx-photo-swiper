import {Component, HostListener} from '@angular/core';
import {SliderService} from '../slider.service';

@Component({
  selector: 'lib-hotkey-listener',
  template: '',
})
export class HotkeyListenerComponent {

  constructor(private sliderService: SliderService) {
  }

  @HostListener('document:keyup.arrowRight', ['$event'])
  r = () => this.sliderService.nextPicture();

  @HostListener('document:keyup.arrowLeft', ['$event'])
  l = () => this.sliderService.previousPicture();

  @HostListener('document:keyup.escape', ['$event'])
  e = () => this.sliderService.closeSlider();

}
