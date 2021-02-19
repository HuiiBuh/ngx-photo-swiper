export class Slider {
  public imageIndex: number = 0;
  public lightboxID: string = '';
  public active: boolean = false;
}

export interface IImage {
  imageSRC: string;
  srcSet?: string | undefined;
  caption?: string;
  smallCaption?: string;
}

export type TGallery = Record<string, IImage[]>;

export class GalleryState {
  public gallery: TGallery = {};
  public slider: Slider = new Slider();
}

export interface SliderInformation {
  imageRange: (IImageIndex | null)[];
  gallerySize: number;
  slider: Slider;
}

export interface IImageIndex extends IImage {
  index: number;
}
