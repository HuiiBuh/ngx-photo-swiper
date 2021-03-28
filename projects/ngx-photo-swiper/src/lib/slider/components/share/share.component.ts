import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ShareService } from '../../services/share.service';

@Component({
    selector: 'photo-share[shareOptionList]',
    templateUrl: './share.component.html',
    styleUrls: ['share.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('openClose', [
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
export class ShareComponent {
    @Input() public shareOptionList: TemplateRef<HTMLAnchorElement[]> | undefined;

    public display: 'block' | 'none' = 'none';
    public visibility$: Observable<boolean>;

    constructor(public shareService: ShareService) {
        this.visibility$ = this.shareService.visible$;
    }
}
