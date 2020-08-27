import {Component} from '@angular/core';
import {TShareOptionList} from '../../../projects/ngx-lightbox/src/lib/slider/slider-interfaces';
import {testData} from './test.data';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    data = testData;
    title = 'ngx-lightbox-app';
    public shareOptions: TShareOptionList = [{
        name: 'Google',
        url: 'https://google.com',
    }, {
        name: 'Amazon',
        url: 'https://amazon.com',
    }, {
        name: 'Twitter',
        url: 'https://twitter.com',
    }, {
        name: 'YouTube',
        url: 'https://youtube.com',
    }];
}
