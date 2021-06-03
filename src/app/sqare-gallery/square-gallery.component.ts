import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResponsiveSliderImage, SliderImage } from '../../../projects/ngx-photo-swiper/src/lib/models/gallery';
import { testData } from '../test.data';

@Component({
  selector: 'app-square-gallery',
  templateUrl: './square-gallery.component.html',
  styleUrls: ['./square-gallery.component.scss'],
})
export class SquareGalleryComponent {
  public data: (SliderImage | ResponsiveSliderImage)[] = testData;

  constructor(
    public router: Router
  ) {
  }

}
