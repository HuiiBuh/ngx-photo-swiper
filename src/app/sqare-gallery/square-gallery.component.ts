import { Component } from '@angular/core';
import { IImage } from '../../../projects/ngx-photo-swiper/src/lib/models/gallery';
import { testData } from '../test.data';

@Component({
  selector: 'app-square-gallery',
  templateUrl: './square-gallery.component.html',
  styleUrls: ['./square-gallery.component.scss'],
})
export class SquareGalleryComponent {
  public data: IImage[] = testData;

}
