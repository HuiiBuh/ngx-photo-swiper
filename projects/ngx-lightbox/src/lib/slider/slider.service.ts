import {Injectable} from '@angular/core';
import {LightboxStore} from '../store/lightbox.store';
import {UrlSliderHandlerService} from './url-slider-handler.service';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  constructor(private store: LightboxStore, private urlSliderHandler: UrlSliderHandlerService) {
  }

  previousPicture(): void {
    this.store.moveImageIndex(-1);
  }

  nextPicture(): void {
    this.store.moveImageIndex(1);
  }

  closeSlider(): void {
    this.store.closeSlider();
  }

}
