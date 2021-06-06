import { ImageAnimationFactory } from './animation.models';

const IMAGE_CHANGE_OPTIONS: KeyframeAnimationOptions = {
  duration: 200,
  easing: 'cubic-bezier(0, 0, 0, 1)'
};

export const DEFAULT_IMAGE_CHANGE_FACTORY: ImageAnimationFactory = {
  right: () => ({
    keyframe: [{transform: 'translate3d(-110vw, 0, 0)'}],
    options: IMAGE_CHANGE_OPTIONS
  }),
  left: () => ({
    keyframe: [{transform: 'translate3d(110vw, 0, 0)'}],
    options: IMAGE_CHANGE_OPTIONS
  }),
  center: () => ({
    keyframe: [{transform: 'translate3d(0, 0, 0)'}],
    options: IMAGE_CHANGE_OPTIONS
  }),
};
