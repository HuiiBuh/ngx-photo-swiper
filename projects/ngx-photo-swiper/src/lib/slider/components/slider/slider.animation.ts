interface AnimationReturn {
  keyframe: Keyframe[] | PropertyIndexedKeyframes | null;
  options?: (number | KeyframeAnimationOptions);
}

export interface ImageAnimationFactory {
  right(): AnimationReturn;

  left(): AnimationReturn;

  center(): AnimationReturn;
}

const DEFAULT_OPTIONS: KeyframeAnimationOptions = {
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

interface OpenCloseFactory {
  open(): AnimationReturn;

  close(): AnimationReturn;

  center(): AnimationReturn;
}

const OPEN_CLOSE_OPTIONS: KeyframeAnimationOptions = {
  duration: 300,
  easing: 'cubic-bezier(.19,.75,.53,.9)'
};

export const DEFAULT_OPEN_CLOSE_FACTORY: OpenCloseFactory = {
  open: () => ({
    keyframe: [{opacity: 1}],
    options: OPEN_CLOSE_OPTIONS
  }),
  close: () => ({
    keyframe: [{opacity: 0}],
    options: OPEN_CLOSE_OPTIONS
  }),
  center: () => ({
    keyframe: [],
    options: OPEN_CLOSE_OPTIONS
  })
};
