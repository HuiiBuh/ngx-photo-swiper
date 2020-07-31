import {Component, Input, OnInit} from '@angular/core';
import {IImage} from '../interfacecs/ngx-lightbox.interfaces';

@Component({
  selector: 'lib-lightbox-wrapper[images]',
  templateUrl: 'ngx-lightbox.component.html',
  styleUrls: ['ngx-lightbox.component.scss'],
})
export class NgxLightboxComponent implements OnInit {


  @Input() images!: IImage[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
