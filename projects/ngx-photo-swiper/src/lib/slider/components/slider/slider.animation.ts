import { animate, state, style, transition, trigger } from '@angular/animations';

interface AnimationReturn {
  keyframe: Keyframe[] | PropertyIndexedKeyframes | null;
  options?: (number | KeyframeAnimationOptions);
}

export interface ImageAnimationFactory {
  right(): AnimationReturn;

  left(): AnimationReturn;

  center(): AnimationReturn;
}

const DEFAULT_OPTIONS = {
  duration: 200,
  easing: 'cubic-bezier(0, 0, 0, 1)'
};

export const DEFAULT_IMAGE_CHANGE_FACTORY: ImageAnimationFactory = {
  right: () => ({
    keyframe: [{transform: 'translate3d(-110vw, 0, 0)'}],
    options: DEFAULT_OPTIONS
  }),
  left: () => ({
    keyframe: [{transform: 'translate3d(110vw, 0, 0)'}],
    options: DEFAULT_OPTIONS
  }),
  center: () => ({
    keyframe: [{transform: 'translate3d(0, 0, 0)'}],
    options: DEFAULT_OPTIONS
  }),

};

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
