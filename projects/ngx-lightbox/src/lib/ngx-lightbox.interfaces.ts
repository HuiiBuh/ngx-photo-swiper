export class Slider {
  imageIndex: number = 0;
  gridID: string = '';
  active: boolean = false;
}

export interface IImage {
  imageSRC: string;
  caption?: string;
  height?: number;
  width?: number;
  description?: string;
  imagePreview?: string;
}


export type TGallery = { string?: IImage[] };

export class GalleryState {
  gallery: TGallery = {};
  slider: Slider = new Slider();
}
