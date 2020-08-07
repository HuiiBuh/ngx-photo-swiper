import {Injectable} from '@angular/core';
import {IImage} from './ngx-lightbox.interfaces';
import {LightboxStore} from './store/lightbox.store';

@Injectable({
  providedIn: 'root'
})
export class NgxLightboxService {

  constructor(private store: LightboxStore) {
  }

  public loadImageInSlider(imageIndex: number, image: IImage, gridID: string): void {
    this.store.updateSlider({imageIndex, gridID, active: true});
  }

}
