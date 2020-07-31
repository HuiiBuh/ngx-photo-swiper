export interface ILightboxConfig {
  images: IImage[];
}

export interface IImage {
  imageSRC: string;
  caption?: string;
  description?: string;
  imagePreview?: string;
}

