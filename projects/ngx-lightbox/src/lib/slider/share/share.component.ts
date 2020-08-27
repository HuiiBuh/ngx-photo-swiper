import {Component, Input} from '@angular/core';
import {TShareOptionList} from '../slider-interfaces';

@Component({
  selector: 'lib-share[shareOptionList]',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent {
  @Input() shareOptionList: TShareOptionList;
}
