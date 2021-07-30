import { Component, OnInit } from '@angular/core';
import { ResponsiveSliderImage, SliderImage } from '../../../projects/ngx-photo-swiper/src/lib/models/gallery';
import { testData } from '../test.data';

@Component({
  selector: 'app-playground',
  templateUrl: './playground-gallery.component.html',
  styleUrls: ['./playground-gallery.component.scss'],
})
export class PlaygroundGalleryComponent implements OnInit {
  public value = '3';
  public data: (SliderImage | ResponsiveSliderImage)[] = [];
  public infiniteSwipe = false;

  public updateCount(value: string): void {
    this.value = value;
    this.data = testData.slice(-value);
  }

  public ngOnInit(): void {
    this.updateCount(this.value);
  }
}
