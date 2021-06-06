export interface AnimationReturn {
  keyframe: Keyframe[] | PropertyIndexedKeyframes | null;
  options?: (number | KeyframeAnimationOptions);
}

export interface AnimationProps {
  galleryImage: HTMLImageElement | null;
  animationImage: HTMLImageElement | null;
}

export interface ImageAnimationFactory {
  right(prosp: AnimationProps): AnimationReturn;

  left(prosp: AnimationProps): AnimationReturn;

  center(prosp: AnimationProps): AnimationReturn;
}

export type OpenCloseAnimation =
  { image: AnimationReturn; background: AnimationReturn; canAnimateImage: true }
  | { background: AnimationReturn; canAnimateImage: false };

// TODO caption
export interface OpenCloseFactory {
  open(prosp: AnimationProps, imageSize: WidthHeight | null, windowSize: WidthHeight | null): OpenCloseAnimation;

  close(
    prosp: AnimationProps,
    imageSize: WidthHeight | null,
    windowSize: WidthHeight | null,
    backgroundOpacity: number
  ): OpenCloseAnimation;

  center(prosp: AnimationProps, imageSize: WidthHeight | null, windowSize: WidthHeight | null): AnimationReturn;
}

export interface WidthHeight<T = number> {
  width: T;
  height: T;
}
