import { Component } from '@angular/core';
import { SliderImage, SliderImageSmall } from '../../../projects/ngx-photo-swiper/src/lib/models/gallery';
import { testData } from '../test.data';

@Component({
  selector: 'app-gallery',
  templateUrl: './flex-gallery.component.html',
  styleUrls: ['./flex-gallery.component.scss'],
})
export class FlexGalleryComponent {
  public data: (SliderImage | SliderImageSmall)[] = testData;
}
