import { animate, state, style, transition, trigger } from '@angular/animations';

export const changeImage = trigger('changeImage', [
  state('current', style({
    transform: 'translate3D({{ startPosition }},0,0)',
  }), {params: {startPosition: '0px'}}),
  state('right', style({
    transform: 'translate3d(calc(-110vw), 0px, 0px)',
  })),
  state('left', style({
    transform: 'translate3d(calc(110vw), 0px, 0px)',
  })),
  state('none', style({
    transform: 'translate3d(0, 0px, 0px)',
  })),
  transition('current => right', [
    animate('333ms cubic-bezier(0, 0, 0, 1)'),
  ]),
  transition('current => left', [
    animate('333ms cubic-bezier(0, 0, 0, 1)'),
  ]),
  transition('current => none', [
    animate('333ms cubic-bezier(0, 0, 0, 1)'),
  ]),
]);

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
    animate('666ms cubic-bezier(.02,.72,.74,.71)'),
  ]),
]);
