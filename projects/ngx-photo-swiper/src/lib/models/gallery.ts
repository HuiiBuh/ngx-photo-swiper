export class Slider {
  public imageIndex: number = 0;
  public lightboxID: string = '';
  public active: boolean = false;
}

export interface SliderImage {
  imageSRC: string;
  srcSet?: string | undefined;
  caption?: string;
  smallCaption?: string;
}

export interface SliderImageSmall {
  imageSRC: string;
  smallImage: string;
  aspectRatio: number;
  srcSet?: string;
  caption?: string;
  smallCaption?: string;
}

export type TGallery = Record<string, SliderImage[]>;

export class GalleryState {
  public gallery: TGallery = {};
  public slider: Slider = new Slider();
}

export interface SliderInformation {
  imageRange: (ImageIndex | null)[];
  gallerySize: number;
  slider: Slider;
}

export interface SliderImageIndex extends SliderImage {
  index: number;
}

export interface SliderImageSmallIndex extends SliderImageSmall {
  index: number;
}

export type ImageIndex = (SliderImageIndex | SliderImageSmallIndex);
