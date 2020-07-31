export interface ILightboxConfig {
  images: IImage[];
}

export interface IImage {
  imageSRC: string;
  width: number;
  height: number;
  caption?: string;
  description?: string;
  imagePreview?: string;
}

