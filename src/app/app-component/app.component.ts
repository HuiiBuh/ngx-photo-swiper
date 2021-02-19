import { AfterViewChecked, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewChecked {
  public title = 'ngx-photo-swiper-app';

  constructor(public router: Router) {
  }

  public ngAfterViewChecked(): void {
    // console.log('Checked');
  }
}
