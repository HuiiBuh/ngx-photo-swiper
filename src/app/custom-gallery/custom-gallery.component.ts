import { Component } from '@angular/core';
import { ResponsiveSliderImage, SliderImage } from '../../../projects/ngx-photo-swiper/src/lib/models/gallery';
import { testData } from '../test.data';

@Component({
  selector: 'app-custom-gallery',
  templateUrl: './custom-gallery.component.html',
  styleUrls: ['./custom-gallery.component.scss'],
})
export class CustomGalleryComponent {
  public data: (SliderImage | ResponsiveSliderImage)[] = testData;
}
