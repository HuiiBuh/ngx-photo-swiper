import { AfterViewChecked, Component, enableProdMode } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewChecked {
  public title = 'ngx-photo-swiper-app';

  constructor(public router: Router) {
    if (environment.production) enableProdMode();
  }

  public ngAfterViewChecked(): void {
    // console.log('Checked');
  }
}
