import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {TShareOptionList} from '../slider-interfaces';
import {ShareService} from './share.service';

@Component({
  selector: 'lib-share[shareOptionList]',
  templateUrl: './share.component.html',
  styleUrls: ['share.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        opacity: 1,
        transform: 'translateY(0)',
      })),
      state('closed', style({
        opacity: 0,
        transform: 'translateY(-10px)',
      })),
      transition('open <=> closed', [
        animate('333ms cubic-bezier(0.4, 0, 0.22, 1)'),
      ]),
    ]),
  ],
})
export class ShareComponent implements OnInit, OnDestroy {

  @Input() shareOptionList: TShareOptionList = [];
  public display: 'block' | 'none' = 'none';
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
