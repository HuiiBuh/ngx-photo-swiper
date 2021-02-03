import { Injectable } from '@angular/core';
import { LightboxStore } from './store/lightbox.store';

@Injectable({
  providedIn: 'root',
})
export class NgxLightboxService {

  constructor(private store: LightboxStore) {
  }

  public loadIndexInSlider(imageIndex: number, lightboxID: string): void {
    this.store.updateSlider({imageIndex, lightboxID, active: true});
  }
}
