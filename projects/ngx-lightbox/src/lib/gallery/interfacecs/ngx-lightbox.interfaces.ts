export interface ILightboxConfig {
  images: IImage[];
}

export interface IImage {
  imageSRC: string;
  caption?: string;
  height?: number;
  width?: number;
  description?: string;
  imagePreview?: string;
}

