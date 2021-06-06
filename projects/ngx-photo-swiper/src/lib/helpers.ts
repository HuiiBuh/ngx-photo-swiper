import { ResponsiveSliderImage, SliderImage } from './models/gallery';

export const animationsFinished = async (animationList: Animation[]): Promise<void> => {
  const promiseList = animationList.map(animation => new Promise<void>(resolve => animation.onfinish = () => resolve()));
  await Promise.all(promiseList);
};

export const isResponsiveImage = (image: ResponsiveSliderImage | SliderImage): image is ResponsiveSliderImage => {
  return 'width' in image && 'height' in image;
};
