import {Injectable} from '@angular/core';
import {GalleryState, Slider, TGallery} from '../ngx-lightbox.interfaces';
import {Store} from './store';

@Injectable()
export class LightboxStore extends Store<GalleryState> {
  constructor() {
    super(new GalleryState());
  }

  public addGallery(gallery: TGallery): void {
    this.patchState<TGallery>({
      ...this.state.gallery,
      ...gallery
    }, 'gallery');
  }

  public updateSlider(slider: Slider): void {
    this.patchState<Slider>(slider, 'slider');
  }

  public closeSlider(): void {
    this.patchState<Slider>({
      ...this.state.slider,
      active: false
    }, 'slider');
  }

  public moveImageIndex(moveCount: number): void {
    const newPosition = this.state.slider.imageIndex + moveCount;

    if (newPosition >= this.state.gallery[this.state.slider.gridID].length
      || newPosition < 0) {
      return;
    }

    this.patchState<Slider>({
      ...this.state.slider,
      imageIndex: newPosition
    }, 'slider');
  }
}
