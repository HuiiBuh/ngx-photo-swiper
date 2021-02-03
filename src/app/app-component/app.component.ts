import { AfterViewChecked, Component } from '@angular/core';
import { IImage } from '../../../projects/ngx-photo-swiper/src/lib/models/gallery';
import { testData } from './test.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewChecked {
  public data: IImage[] = testData;
  public title = 'ngx-photo-swiper-app';

  public ngAfterViewChecked(): void {
    console.log('Checked');
  }
}
