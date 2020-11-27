export class Slider {
  public imageIndex: number = 0;
  public gridID: string = '';
  public active: boolean = false;
}

export interface IImage {
  imageSRC: string;
  caption?: string;
  height?: number;
  width?: number;
  description?: string;
  imagePreview?: string;
}

export type TGallery = Record<string, IImage[]> ;

export class GalleryState {
  gallery: TGallery = {};
  slider: Slider = new Slider();
}

export interface SliderInformation {
  imageRange: (IImageIndex | null)[];
  gallerySize: number;
  slider: Slider;
}

export interface IImageIndex extends IImage {
  index: number;
}
