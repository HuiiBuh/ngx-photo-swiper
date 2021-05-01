import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy } from '@angular/core';
import { ImageWithIndex, SliderImageIndex } from '../../../models/gallery';
import { LightboxStore } from '../../../store/lightbox.store';

@Component({
  selector: 'photo-caption[sliderImages][currentImageIndex]',
  templateUrl: './caption.component.html',
  styleUrls: ['./caption.component.scss', '../../image-center-style.scss'],
})
export class CaptionComponent implements OnDestroy {

  private static GLOBAL_ID = 0;
  private static IMAGES_IN_SLIDER: (SliderImageIndex | null | undefined)[] = new Array(3);

  public currentImage: ImageWithIndex | null | undefined = null;
  public largeImageVisible: boolean = false;
  public readonly id: number;
  @Input() private currentImageIndex: number = 0;

  constructor(private store: LightboxStore, @Inject(DOCUMENT) private document: Document) {
    this.id = CaptionComponent.GLOBAL_ID;
    CaptionComponent.GLOBAL_ID += 1;
  }

  @Input()
  private set sliderImages(value: (ImageWithIndex | null)[]) {
    let image = value.find(i => i?.index === this.currentImage?.index);
    if (!image && !this.currentImage) {
      image = value[this.id];
    } else if (!image) {
      const indexList = CaptionComponent.IMAGES_IN_SLIDER.map(i => i?.index);
      image = value.filter(i => !indexList.includes(i?.index))[0];
    }

    CaptionComponent.IMAGES_IN_SLIDER[this.id] = image;
    this.currentImage = image;
  }

  public ngOnDestroy(): void {
    CaptionComponent.GLOBAL_ID -= 1;
  }

  /**
   * Get the index of the image
   */
  public getImageIndex(): number {
    let returnIndex = 0;

    if (this.currentImage) {
      returnIndex = ((this.currentImage.index - (this.currentImageIndex % 3) + 1) % 3);
    }

    return returnIndex;
  }

}
