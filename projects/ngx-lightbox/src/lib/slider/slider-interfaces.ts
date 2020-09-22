import {IImage} from '../ngx-lightbox.interfaces';

export interface IShareOption {
  name: string;
  url: string;
}

export type TShareOptionList = IShareOption[];

export interface IImageIndex extends IImage {
  index: number;
}
