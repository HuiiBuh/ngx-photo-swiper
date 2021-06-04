import { Component, OnInit } from '@angular/core';
import { ResponsiveSliderImage, SliderImage } from '../../../projects/ngx-photo-swiper/src/lib/models/gallery';
import { testData } from '../test.data';

@Component({
  selector: 'app-few-images',
  templateUrl: './few-images-gallery.component.html',
  styleUrls: ['./few-images-gallery.component.scss'],
})
export class FewImagesGalleryComponent implements OnInit {
  public value = '3';
  public data: (SliderImage | ResponsiveSliderImage)[] = [];
  public infiniteSwipe = true;

  public updateCount(value: string): void {
    this.value = value;
    this.data = testData.slice(-value);
  }

  public ngOnInit(): void {
    this.updateCount(this.value);
  }
}
