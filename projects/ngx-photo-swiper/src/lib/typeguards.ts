import { SliderImage, SliderImageSmall } from './models/gallery';

// From https://github.com/krzkaczor/ts-essentials
type Exact<T, SHAPE> = T extends SHAPE ? (Exclude<keyof T, keyof SHAPE> extends never ? T : never) : never;

export function checkImageData<T extends SliderImageSmall | SliderImage>(
  value: (T extends SliderImageSmall ? Exact<T, SliderImageSmall> : Exact<T, SliderImage>)[],
): (SliderImageSmall | SliderImage)[] {
  return value;
}
