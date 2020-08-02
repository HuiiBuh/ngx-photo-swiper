import {Injectable} from '@angular/core';
import {LightboxStore} from '../store/lightbox.store';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  constructor(private store: LightboxStore) {
  }
}
