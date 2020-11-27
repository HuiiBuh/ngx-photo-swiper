import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShareService } from './share.service';

@Component({
  selector: 'photo-share[shareOptionList]',
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

  @Input() shareOptionList: TemplateRef<HTMLAnchorElement[]> | undefined;

  public display: 'block' | 'none' = 'none';
  public visibility: 'open' | 'closed' = 'closed';

  private unsubscribe!: Subscription;

  constructor(public shareService: ShareService) {
  }

  public ngOnInit(): void {
    this.unsubscribe = this.shareService.visible$.subscribe((visible => {
      this.visibility = visible ? 'open' : 'closed';
    }));
  }

  public ngOnDestroy(): void {
    this.unsubscribe.unsubscribe();
  }
}
