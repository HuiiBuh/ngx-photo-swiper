import {TAnimation} from './slider';

export interface SliderImage {
  imageSRC: string;
  srcSet?: string | undefined;
  caption?: string;
  smallCaption?: string;
  nativeImage?: HTMLImageElement;
}

export interface SliderImageIndex extends SliderImage {
  index: number;
}

export interface ResponsiveSliderImage {
  imageSRC: string;
  smallImage: string;
  width: number;
  height: number;
  srcSet?: string;
  caption?: string;
  smallCaption?: string;
  nativeImage?: HTMLImageElement;
}

export interface ResponsiveSliderImageIndex extends ResponsiveSliderImage {
  index: number;
}

export type ImageWithIndex = (SliderImageIndex | ResponsiveSliderImageIndex);

export interface GalleryModel {
  images: (SliderImage | ResponsiveSliderImage)[];
  infiniteSwipe: boolean;
}

export type GalleryCollection = Record<string, GalleryModel>;

export interface SliderModel {
  imageIndex: number;
  lightboxID: string;
  active: boolean;
  shareVisible: boolean;
}

export interface SliderInformation {
  imageRange: (ImageWithIndex | null)[];
  gallerySize: number;
  slider: SliderModel;
}

export interface AnimationModel {
  time: number;
  animation: TAnimation;

}

export interface GalleryState {
  gallery: GalleryCollection;
  slider: SliderModel;
  animation: AnimationModel;
}
