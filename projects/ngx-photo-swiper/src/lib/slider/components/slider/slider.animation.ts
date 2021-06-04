interface AnimationReturn {
  keyframe: Keyframe[] | PropertyIndexedKeyframes | null;
  options?: (number | KeyframeAnimationOptions);
}

export interface AnimationProps {
  galleryImage: HTMLImageElement | null;
  sliderImage: HTMLImageElement | null;
}

export interface ImageAnimationFactory {
  right(prosp: AnimationProps): AnimationReturn;

  left(prosp: AnimationProps): AnimationReturn;

  center(prosp: AnimationProps): AnimationReturn;
}

interface OpenCloseFactory {
  open(prosp: AnimationProps): { image: AnimationReturn; background: AnimationReturn };

  close(prosp: AnimationProps): { image: AnimationReturn; background: AnimationReturn };

  center(prosp: AnimationProps): AnimationReturn;
}

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

const OPEN_CLOSE_OPTIONS: KeyframeAnimationOptions = {
  duration: 300,
  easing: 'cubic-bezier(.19,.75,.53,.9)'
};

export const DEFAULT_OPEN_CLOSE_FACTORY: OpenCloseFactory = {
  open: ({galleryImage, sliderImage}) => {
    const backgroundAnimation: AnimationReturn = {
      keyframe: [{opacity: 0}, {opacity: 1}],
      options: OPEN_CLOSE_OPTIONS
    };

    if (!galleryImage || !sliderImage) {
      return {
        background: backgroundAnimation,
        image: backgroundAnimation
      };
    }

    const largePosition = sliderImage.getBoundingClientRect();
    const smallPosition = galleryImage.getBoundingClientRect();

    return {
      background: backgroundAnimation,
      image: {
        keyframe: [{
          height: largePosition.height,
          width: largePosition.width,
          top: largePosition.top,
          left: largePosition.left
        }, {
          height: smallPosition.height,
          width: smallPosition.width,
          top: smallPosition.top,
          left: smallPosition.left
        }],
        options: OPEN_CLOSE_OPTIONS
      }
    };
  },
  close: ({galleryImage, sliderImage}) => {
    const backgroundAnimation: AnimationReturn = {
      keyframe: [{opacity: 1}, {opacity: 0}],
      options: OPEN_CLOSE_OPTIONS
    };

    if (!galleryImage || !sliderImage) {
      return {
        background: backgroundAnimation,
        image: backgroundAnimation
      };
    }

    const largePosition = sliderImage.getBoundingClientRect();
    const smallPosition = galleryImage.getBoundingClientRect();

    sliderImage.style.height = `${smallPosition.height}px`;
    sliderImage.style.width = `${smallPosition.width}px`;
    sliderImage.style.top = `${smallPosition.top}px`;
    sliderImage.style.left = `${smallPosition.left}px`;
    sliderImage.style.position = 'static';

    return {
      background: backgroundAnimation,
      image: {
        keyframe: [{
          height: `${largePosition.height}px`,
          width: `${largePosition.width}px`,
          top: `${largePosition.top}px`,
          left: `${largePosition.left}px`,
        }, {
          height: `${smallPosition.height}px`,
          width: `${smallPosition.width}px`,
          top: `${smallPosition.top}px`,
          left: `${smallPosition.left}px`,
        }],
        options: OPEN_CLOSE_OPTIONS
      }
    };
  },
  center: () => ({
    keyframe: [],
    options: OPEN_CLOSE_OPTIONS
  })
};
