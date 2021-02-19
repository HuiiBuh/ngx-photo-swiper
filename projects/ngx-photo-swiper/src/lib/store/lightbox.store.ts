import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GalleryState, ImageIndex, Slider, SliderImage, SliderImageSmall, SliderInformation, TGallery } from '../models/gallery';
import { Store } from './store';

@Injectable()
export class LightboxStore extends Store<GalleryState> {
  constructor() {
    super(new GalleryState());
  }

  public get sliderImages$(): BehaviorSubject<SliderInformation> {

    const subject = new BehaviorSubject<SliderInformation>(
      {
        imageRange: new Array(3),
        gallerySize: 0,
        slider: new Slider(),
      },
    );

    this.onChanges<Slider>('slider').subscribe((slider: Slider) => {
      const imageList: (ImageIndex | null)[] = new Array(3);

      let gallery: (SliderImage | SliderImageSmall)[] = [];

      if (slider.active) {
        gallery = this.state.gallery[slider.lightboxID];

        for (const i of [-1, 0, 1]) {
          const image = gallery[slider.imageIndex + i];
          if (image) {
            imageList[i + 1] = {
              ...gallery[slider.imageIndex + i],
              index: slider.imageIndex + i,
            };
          } else {
            imageList[i + 1] = null;
          }
        }
      }

      subject.next({
        imageRange: imageList,
        gallerySize: gallery.length,
        slider: this.state.slider,
      });
    });

    return subject;
  }

  /**
   * Add a gallery to the store
   * @param gallery The gallery which should be added
   */
  public addGallery(gallery: TGallery): void {
    this.patchState<TGallery>({
      ...this.state.gallery,
      ...gallery,
    }, 'gallery');
  }

  /**
   * Update the slider with a new state
   * @param slider The new slider state
   */
  public updateSlider(slider: Slider): void {
    this.patchState<Slider>(slider, 'slider');
  }

  /**
   * Close the slider
   */
  public closeSlider(): void {
    this.patchState<Slider>({
      ...this.state.slider,
      active: false,
    }, 'slider');
  }

  /**
   * Move the slider image index
   * @param moveCount The direction and the amount the index should move
   */
  public moveImageIndex(moveCount: number): void {
    const newPosition = this.state.slider.imageIndex + moveCount;

    if (newPosition >= this.state.gallery[this.state.slider.lightboxID].length
      || newPosition < 0) {
      return;
    }

    this.patchState<Slider>({
      ...this.state.slider,
      imageIndex: newPosition,
    }, 'slider');
  }

}
