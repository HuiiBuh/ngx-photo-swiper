import { AnimationReturn, OpenCloseFactory, WidthHeight } from './animation.models';

interface Position<T = number> {
  height: T;
  width: T;
  top: T;
  left: T;
}

const calculateImagePosition = (imageSize: WidthHeight, windowSize: WidthHeight, captionHeight: number): Position<string> => {
  //                                               top bar
  const availableHeight = windowSize.height - 44 - captionHeight;
  //                                               right/left icon
  const availableWidth = windowSize.width - 32 * 2;

  let height: number;
  let width: number;
  if (availableWidth / imageSize.width < availableHeight / imageSize.height) {
    const factor = availableWidth / imageSize.width;
    height = imageSize.height * factor;
    width = availableWidth;
  } else {
    const factor = availableHeight / imageSize.height;
    height = availableHeight;
    width = imageSize.width * factor;
  }

  console.log(windowSize.height - height);
  return {
    height: `${height}px`,
    // TODO seems to move
    left: `${(windowSize.width - width) / 2}px`,
    // TODO something more elegant
    top: `${44}px`,
    width: `${width}px`
  };
};

const prepareAnimationImage = (element: HTMLImageElement, position: Position, src: string) => {
  element.style.height = `${position.height}px`;
  element.style.width = `${position.width}px`;
  element.style.top = `var(--top-height)`;
  element.style.left = `${position.left}px`;
  element.style.position = 'fixed';
  element.style.objectFit = 'cover';
  element.style.zIndex = '1';
  element.src = src;
};

const getImageKeyframes = (position: Position) => ({
  height: `${position.height}px`,
  width: `${position.width}px`,
  top: `${position.top}px`,
  left: `${position.left}px`,
});

const OPEN_CLOSE_OPTIONS: KeyframeAnimationOptions = {
  duration: 300,
  easing: 'cubic-bezier(.19,.75,.53,.9)'
};

export const DEFAULT_OPEN_CLOSE_FACTORY: OpenCloseFactory = {
  open: ({galleryImage, animationImage}, imageSize, windowSize, captionHeight) => {
    const backgroundAnimation: AnimationReturn = {
      keyframe: [{opacity: 0}, {opacity: 1}],
      options: OPEN_CLOSE_OPTIONS
    };

    if (!galleryImage || !animationImage || !imageSize || !windowSize) return {background: backgroundAnimation, canAnimateImage: false};

    const smallPosition = galleryImage.getBoundingClientRect();
    prepareAnimationImage(animationImage, smallPosition, galleryImage.currentSrc);

    return {
      background: backgroundAnimation,
      image: {
        keyframe: [
          getImageKeyframes(smallPosition),
          calculateImagePosition(imageSize, windowSize, captionHeight ? captionHeight : 0) as unknown as Keyframe,
        ],
        options: OPEN_CLOSE_OPTIONS
      },
      canAnimateImage: true
    };
  },
  close: ({galleryImage, animationImage}, imageSize, windowSize, backgroundOpacity) => {
    const backgroundAnimation: AnimationReturn = {
      keyframe: [{opacity: backgroundOpacity}, {opacity: 0}],
      options: OPEN_CLOSE_OPTIONS
    };

    if (!galleryImage || !animationImage || !imageSize || !windowSize) {
      return {
        background: backgroundAnimation,
        canAnimateImage: false
      };
    }

    const largePosition = animationImage.getBoundingClientRect();
    prepareAnimationImage(animationImage, largePosition, galleryImage.src);

    const smallPosition = galleryImage.getBoundingClientRect();

    return {
      background: backgroundAnimation,
      image: {
        keyframe: [
          calculateImagePosition(imageSize, windowSize, 0) as unknown as Keyframe,
          getImageKeyframes(smallPosition),
        ],
        options: OPEN_CLOSE_OPTIONS
      },
      canAnimateImage: true
    };
  },
  center: () => ({
    keyframe: [],
    options: OPEN_CLOSE_OPTIONS
  })
};
