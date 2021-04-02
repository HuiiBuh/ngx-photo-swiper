import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {
  AnimationModel,
  GalleryCollection,
  GalleryModel,
  GalleryState,
  ImageWithIndex,
  ResponsiveSliderImage,
  SliderImage,
  SliderInformation,
  SliderModel,
} from '../models/gallery';
import {TAnimation} from '../models/slider';
import {Store} from './store';

@Injectable()
export class LightboxStore extends Store<GalleryState> {
  constructor() {
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

  /**
   * Get the relevant slider images (3)
   */
  public get sliderImages$(): Observable<SliderInformation> {

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

    return this.onChanges<SliderModel>('slider').pipe(
      map(slider => toSliderInformation(slider)),
    );
  }

  public animateTo(to: TAnimation): void {
    this.patchState<AnimationModel>({
      animation: to,
      time: new Date().getUTCMilliseconds()
    }, 'animation');
  }

  public getAnimation$(): Observable<TAnimation> {
    return this.state$.pipe(
      map(state => state.animation),
      distinctUntilChanged(),
      map(animation => animation.animation)
    );
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

  public toggleShare(): void {
    this.patchState(!this.state.slider.shareVisible, 'slider', 'shareVisible');
  }

  public closeShare(): void {
    this.patchState(false, 'slider', 'shareVisible');
  }

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
          infiniteSwipe: true, images: [],
          ...gallery,
        },
      });
    }
  }

  /**
   * Update the slider with a new state
   * @param slider The new slider state
   */
  public updateSlider(slider: Partial<SliderModel>): void {
    this.patchState<SliderModel>({
      ...this.state.slider,
      ...slider,
    }, 'slider');
  }

  /**
   * Close the slider
   */
  public closeSlider(): void {
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
