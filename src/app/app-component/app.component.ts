import {Component} from '@angular/core';
import {testData} from './test.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  data = testData;
  title = 'ngx-lightbox-app';
}
