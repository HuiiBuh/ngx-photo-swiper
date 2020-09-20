import {EventEmitter, Injectable} from '@angular/core';
import {TAnimation} from './slider.types';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  public animateTo$: EventEmitter<TAnimation> = new EventEmitter<TAnimation>();

}
