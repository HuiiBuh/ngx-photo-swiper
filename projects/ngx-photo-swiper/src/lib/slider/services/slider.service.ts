import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { GalleryState } from '../../models/gallery';
import { LightboxStore } from '../../store/lightbox.store';
import { UrlHandlerService } from './url-handler.service';

// @dynamic
@Injectable({
  providedIn: 'root',
})
export class SliderService {
  public galleryState: GalleryState | undefined;

  constructor(
    private store: LightboxStore,
    private _: UrlHandlerService,
    @Inject(DOCUMENT) private document: Document) {
    this.store.state$.subscribe(value => this.galleryState = value);
  }

  /**
   * Check if the slider is active
   */
  public get active(): boolean {
    return !!this.galleryState && this.galleryState.slider.active;
  }

  /**
   * Get the image count of the slider
   */
  public get sliderLength(): number {
    if (this.galleryState) {
      return this.galleryState.gallery[this.galleryState.slider.lightboxID].images.length;
    }
    return 0;
  }

  /**
   * Go to the previous image
   */
  public previousPicture(): void {
    this.store.moveImageIndex(-1);
  }

  /**
   * Go to the next image
   */
  public nextPicture(): void {
    this.store.moveImageIndex(1);
  }

  /**
   * Close the slider
   */
  public closeSlider(): void {
    // Close the fullscreen if you close the gallery
    this.document.exitFullscreen().catch(_ => null);
    this.store.closeSlider();
  }

  /**
   * Check if the current image is the last image
   */
  public isLastImage(): boolean {
    if (this.galleryState) {
      return this.galleryState.slider.imageIndex === this.galleryState.gallery[this.galleryState.slider.lightboxID].images.length - 1;
    }
    return false;
  }

  /**
   * Check if the image is the first image
   */
  public isFirstImage(): boolean {
    if (this.galleryState) {
      return this.galleryState.slider.imageIndex === 0;
    }
    return false;
  }

  public supportsInfiniteSwipe(): boolean {
    return this.store.state.gallery[this.store.state.slider.lightboxID].infiniteSwipe;
  }

}
