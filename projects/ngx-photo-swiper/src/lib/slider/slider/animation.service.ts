import { EventEmitter, Injectable } from '@angular/core';
import { TAnimation } from '../../models/slider';

@Injectable({
  providedIn: 'root',
})
export class AnimationService {

  private readonly _animateTo: EventEmitter<TAnimation> = new EventEmitter<TAnimation>();
  public animateTo$ = this._animateTo.asObservable();

  public animateTo(to: TAnimation): void {
    this._animateTo.emit(to);
  }
}
