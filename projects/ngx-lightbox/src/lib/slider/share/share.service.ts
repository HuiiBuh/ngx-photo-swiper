import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  public shareVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
