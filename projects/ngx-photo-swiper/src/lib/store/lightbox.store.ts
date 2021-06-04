import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import {
  AnimationModel,
  GalleryCollection,
  GalleryModel,
  GalleryState,
  ImageWithIndex,
  OpenSliderModel,
  ResponsiveSliderImage,
  SliderImage,
  SliderInformation,
  SliderModel,
} from '../models/gallery';
import { TAnimation } from '../models/slider';
import { Store } from './store';

// @dynamic
@Injectable()
export class LightboxStore extends Store<GalleryState> {
  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    super({
      slider: {
        lightboxID: '',
        imageIndex: 0,
        shareVisible: false,
        active: false,
      },
      gallery: {},
      animation: {
        time: 0,
        animation: 'none',
      }
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Subscribe to
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Get currently active slider images 3
   */
  public getSliderImages$(): Observable<SliderInformation> {

    const toSliderInformation = (slider: SliderModel): SliderInformation => {
      const imageList: (ImageWithIndex | null)[] = new Array(3);

      const gallery = this.state.gallery[slider.lightboxID];

      if (slider.active) {

        for (const i of [-1, 0, 1]) {
          if (gallery.images[slider.imageIndex + i]) {
            imageList[i + 1] = {
              ...gallery.images[slider.imageIndex + i],
              index: slider.imageIndex + i,
            };
          } else {
            if (gallery.infiniteSwipe) {
              const position = this.calculatePosition(i);
              imageList[i + 1] = {
                ...gallery.images[position],
                index: position,
              };
            } else {
              imageList[i + 1] = null;
            }
          }
        }
      }
      return {
        imageRange: imageList,
        gallerySize: gallery?.images?.length,
        slider: this.state.slider,
      };
    };

    return this.getSlider$().pipe(
      map(slider => toSliderInformation(slider)),
    );
  }

  /**
   * Returns the active state of the slider
   */
  public getSliderActive$(): Observable<boolean> {
    return this.onChanges('slider', 'active');
  }

  /**
   * Get the amount of  images in the slider
   */
  public getSliderLength$(): Observable<number> {
    return this.state$.pipe(
      filter(state => state.slider.active),
      map(state => state.gallery[state.slider.lightboxID].images.length)
    );
  }

  /**
   * Get the current image index
   */
  public getImageIndex$(): Observable<number> {
    return this.onChanges('slider', 'imageIndex');
  }

  /**
   * Subscribe to the animation request
   */
  public getAnimationRequest$(): Observable<TAnimation> {
    return this.state$.pipe(
      map(state => state.animation),
      distinctUntilChanged(),
      map(animation => animation.animation)
    );
  }

  /**
   * Check if the current image is the last image
   */
  public getIsLastImage$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => {
        return state.slider.imageIndex === state.gallery[state.slider.lightboxID].images.length - 1;
      })
    );
  }

  /**
   * Check if the current image is the first image
   */
  public getIsFirstImage$(): Observable<boolean> {
    return this.onChanges<number>('slider', 'imageIndex').pipe(
      map(index => index === 0)
    );
  }

  /**
   * Check if the gallery supports infinite swipe
   */
  public getHasInfiniteSwipe$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state.gallery[state.slider.lightboxID].infiniteSwipe)
    );
  }

  /**
   * Get the current slider
   */
  public getSlider$(): Observable<SliderModel> {
    return this.onChanges<SliderModel>('slider');
  }

  /**
   * Get a certain gallery
   * @param galleryId The id of the gallery you want to subscribe to
   */
  public getGallery$(galleryId: string): Observable<GalleryModel> {
    return this.onChanges<GalleryModel>('gallery', galleryId);
  }

  /**
   * Check if the share overlay is visible
   */
  public getShareVisible$(): Observable<boolean> {
    return this.onChanges<boolean>('slider', 'shareVisible');
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get current state
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public getCurrentImage(): ImageWithIndex | null {
    if (!this.state.slider.active) return null;

    const imageIndex = this.state.slider.imageIndex;
    const lightboxId = this.state.slider.lightboxID;
    return {
      ...this.state.gallery[lightboxId].images[imageIndex],
      index: imageIndex
    };
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Change state to
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Request the animation to a direction. This will change/open the image/slider
   * @param to The direction which gets requested
   */
  public animateTo(to: TAnimation): void {
    this.patchState<AnimationModel>({
      animation: to,
      time: new Date().getUTCMilliseconds()
    }, 'animation');
  }

  /**
   * Add a gallery to the store
   * @param gallery The gallery which should be added
   */
  public addGallery(gallery: GalleryCollection): void {
    this.patchState<GalleryCollection>({
      ...this.state.gallery,
      ...gallery,
    }, 'gallery');
  }

  /**
   * Add the image element reference to the lightbox image
   * @param lightboxId The id of the lightbox the image is in
   * @param index The image index in the lightbox
   * @param nativeImage The image element
   */
  public addNativeImageElementToSlider(lightboxId: string, index: number, nativeImage: HTMLImageElement): void {
    const images = [...this.state.gallery[lightboxId].images];
    const currentImage = images[index];
    images.splice(index, 1, {...currentImage, nativeImage});
    this.patchState<(SliderImage | ResponsiveSliderImage)[]>(images, 'gallery', lightboxId, 'images');
  }

  /**
   * This will edit an existing library with the values you provided
   * If the gallery does not exist a new gallery will be created. Not provided values will be filled with defaults
   */
  public editOrAddGallery(galleryId: string, gallery: Partial<GalleryModel>): void {
    if (this.state.gallery[galleryId]) {
      this.patchState<GalleryModel>({
        ...this.state.gallery[galleryId],
        ...gallery,
      }, 'gallery', galleryId);
    } else {
      this.addGallery({
        [galleryId]: {
          infiniteSwipe: true,
          images: [],
          ...gallery,
        },
      });
    }
  }

  /**
   * Toggle the share component
   */
  public toggleShare(): void {
    this.patchState(!this.state.slider.shareVisible, 'slider', 'shareVisible');
  }

  /**
   * Close the share component
   */
  public closeShare(): void {
    this.patchState(false, 'slider', 'shareVisible');
  }

  /**
   * Patch the slider state
   * @param slider The new slider state
   */
  public updateSlider(slider: Partial<SliderModel>): void {
    this.patchState<SliderModel>({
      ...this.state.slider,
      ...slider,
    }, 'slider');
  }

  /**
   * Replace the slider with a new slider state
   */
  public openSlider(slider: OpenSliderModel): void {
    this.patchState<SliderModel>({
      ...slider,
      active: true,
      shareVisible: false
    }, 'slider');
    this.animateTo('open');
  }

  /**
   * Close the slider
   */
  public closeSlider(): void {
    this.document.exitFullscreen().catch(_ => null);
    this.patchState<SliderModel>({
      ...this.state.slider,
      active: false,
    }, 'slider');
  }

  /**
   * Move the slider image index
   * @param moveCount The direction and the amount the index should move
   */
  public moveImageIndex(moveCount: number): void {
    this.patchState<SliderModel>({
      ...this.state.slider,
      imageIndex: this.calculatePosition(moveCount),
    }, 'slider');
  }

  /**
   * Calculate the new position of the slider. Depends on the infinite swipe setting
   * @param moveCount The moveCount the image index should get moved (+1 = right, ...)
   */
  private calculatePosition(moveCount: number): number {
    let newPosition = this.state.slider.imageIndex + moveCount;

    const gallery = this.state.gallery[this.state.slider.lightboxID];

    if (!gallery.infiniteSwipe && (newPosition >= gallery.images.length || newPosition < 0)) return this.state.slider.imageIndex;

    if (newPosition >= gallery.images.length) {
      newPosition = newPosition % gallery.images.length;
    } else if (newPosition < 0) {
      newPosition = gallery.images.length + newPosition;
    }

    return newPosition;
  }

}
