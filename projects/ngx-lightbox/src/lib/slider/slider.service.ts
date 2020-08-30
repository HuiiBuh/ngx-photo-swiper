import {Injectable} from '@angular/core';
import {GalleryState} from '../ngx-lightbox.interfaces';
import {LightboxStore} from '../store/lightbox.store';
import {UrlHandlerService} from './url-handler.service';

@Injectable({
  providedIn: 'root',
})
export class SliderService {
  public galleryState: GalleryState | undefined;

  constructor(private store: LightboxStore, private _: UrlHandlerService) {
    this.store.state$.subscribe(value => this.galleryState = value);
  }

  /**
   * Get the caption of the current image
   */
  get imageCaption(): string {
    if (this.galleryState) {
      const caption: string | undefined = this.galleryState.gallery[this.galleryState.slider.gridID]
        [this.galleryState.slider.imageIndex].caption;
      return caption ? caption : '';
    } else {
      return '';
    }
  }

  /**
   * Check if the slider is active
   */
  get active(): boolean {
    if (this.galleryState) {
      return this.galleryState.slider.active;
    }
    return false;
  }

  /**
   * Get the current slider position
   */
  get currentImageIndex(): number {
    if (this.galleryState) {
      return this.galleryState.slider.imageIndex + 1;
    }
    return 0;
  }

  /**
   * Get the image count of the slider
   */
  get sliderLength(): number {
    if (this.galleryState) {
      return this.galleryState.gallery[this.galleryState.slider.gridID].length;
    }
    return 0;
  }

  /**
   * Go to the previous image
   */
  previousPicture(): void {
    this.store.moveImageIndex(-1);
  }

  /**
   * Go to the next image
   */
  nextPicture(): void {
    this.store.moveImageIndex(1);
  }

  /**
   * Close the slider
   */
  closeSlider(): void {
    this.store.closeSlider();
  }

  /**
   * Check if the current image is the last image
   */
  isLastImage(): boolean {
    if (this.galleryState) {
      return this.galleryState.slider.imageIndex !== this.galleryState.gallery[this.galleryState.slider.gridID].length - 1;
    }
    return false;
  }

  /**
   * Check if the image is the first image
   */
  isFirstImage(): boolean {
    if (this.galleryState) {
      return this.galleryState.slider.imageIndex !== 0;
    }
    return false;
  }

}
