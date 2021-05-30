import { animate, state, style, transition, trigger } from '@angular/animations';

export const openClose = trigger('openClose', [
  state('open', style({
    opacity: 1,
  })),
  state('close', style({
    opacity: 0,
  })),
  transition('close => open', [
    animate('333ms cubic-bezier(0.4, 0, 0.22, 1)'),
  ]),
  transition('open => close', [
    animate('333ms cubic-bezier(.19,.75,.53,.9)'),
  ]),
]);
