import {Component, Input, OnInit} from '@angular/core';
import {IImage} from '../interfacecs/ngx-lightbox.interfaces';

@Component({
  selector: 'lib-lightbox-wrapper[imageList]',
  templateUrl: 'ngx-lightbox.component.html',
  styleUrls: ['ngx-lightbox.component.scss'],
})
export class NgxLightboxComponent implements OnInit {

  @Input() imageList!: IImage[];

  window = window;

  constructor() {
  }

  ngOnInit(): void {
    this.imageList.forEach(image => {
      console.log(image.height);
    });
  }

  public log(notExist: string): number {
    console.log(notExist);
    return 50;
  }

  public calculateHeight(image: IImage): number | string {
    if (image.height) {
      return image.height;
    } else {
      return 'undefined';
    }
  }
}
