import { Component } from '@angular/core';
import { SliderImage, SliderImageSmall } from '../../../projects/ngx-photo-swiper/src/lib/models/gallery';
import { testData } from '../test.data';

@Component({
  selector: 'app-own-gallery',
  templateUrl: './own-gallery.component.html',
  styleUrls: ['./own-gallery.component.scss'],
})
export class OwnGalleryComponent {
  public data: (SliderImage | SliderImageSmall)[] = testData;
}
