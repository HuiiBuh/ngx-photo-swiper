import { TAnimation } from './slider';

export interface SliderImage {
  imageSRC: string;
  srcSet?: string | undefined;
  caption?: string;
  smallCaption?: string;
  nativeImage?: HTMLImageElement;
  galleryImage?: string;
}

export interface ResponsiveSliderImage extends SliderImage {
  smallImage: string;
  width: number;
  height: number;
}

export interface SliderImageIndex extends SliderImage {
  index: number;
}

export interface ResponsiveSliderImageIndex extends ResponsiveSliderImage {
  index: number;
}

export type ImageWithIndex = (SliderImageIndex | ResponsiveSliderImageIndex);

export interface GalleryModel {
  images: (SliderImage | ResponsiveSliderImage)[];
  infiniteSwipe: boolean;
}

type GalleryId = string;
export type GalleryCollection = Record<GalleryId, GalleryModel>;

export interface OpenSliderModel {
  imageIndex: number;
  lightboxID: string;
}

export interface SliderModel extends OpenSliderModel {
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
