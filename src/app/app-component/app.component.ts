import { AfterViewChecked, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewChecked {
  public title = 'ngx-photo-swiper-app';

  public ngAfterViewChecked(): void {
    console.log('Checked');
  }
}
