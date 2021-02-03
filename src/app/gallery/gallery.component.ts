import { Component } from '@angular/core';
import { IImage } from '../../../projects/ngx-photo-swiper/src/lib/models/gallery';
import { testData } from '../app-component/test.data';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
  public data: IImage[] = testData;
}
