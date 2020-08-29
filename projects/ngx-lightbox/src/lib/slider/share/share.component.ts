import {Component, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {TShareOptionList} from '../slider-interfaces';
import {ShareService} from './share.service';

@Component({
  selector: 'lib-share[shareOptionList]',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit, OnDestroy {


  @Input() shareOptionList: TShareOptionList = [];

  private unsubscribable: () => void;

  constructor(private renderer2: Renderer2, public shareService: ShareService) {
    this.unsubscribable = () => null;
    this.shareService.shareVisible.subscribe(e => this.changeVisibility(e));
  }

  public ngOnInit(): void {
    this.unsubscribable = () => null;
  }

  public ngOnDestroy(): void {
    this.unsubscribable();
  }

  private changeVisibility(value: boolean): void {
    if (value) {
      this.unsubscribable = this.renderer2.listen('document', 'click', () => {
        this.shareService.shareVisible.next(false);
      });
    } else {
      this.unsubscribable();
      this.unsubscribable = () => null;
    }
  }

}
