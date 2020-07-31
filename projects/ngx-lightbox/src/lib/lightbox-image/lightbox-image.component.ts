import {Component, Input, OnInit} from '@angular/core';
import {IImage} from '../interfacecs/ngx-lightbox.interfaces';

@Component({
  selector: 'lib-lightbox-image',
  templateUrl: './lightbox-image.component.html',
  styleUrls: ['./lightbox-image.component.scss'],
})
export class LightboxImageComponent implements OnInit {

  @Input()
  // @ts-ignore
  public data: IImage;

  constructor() {
  }

  ngOnInit(): void {
  }

}
