import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private readonly _visible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public visible$ = this._visible.asObservable();

  get visible(): boolean {
    return this._visible.value;
  }

  toggle(): void {
    this._visible.next(!this.visible);
  }

  public open(): void {
    this._visible.next(true);
  }

  public close(): void {
    this._visible.next(false);
  }

}
