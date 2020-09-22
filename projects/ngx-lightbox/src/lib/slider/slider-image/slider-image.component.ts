import {Component, Input, OnChanges} from '@angular/core';
import {IImageIndex} from '../slider-interfaces';
import {AnimationService} from '../slider/animation.service';

@Component({
  selector: 'lib-slider-image[sliderImages][currentImageIndex]',
  templateUrl: './slider-image.component.html',
  styleUrls: ['./slider-image.component.scss'],
})
export class SliderImageComponent implements OnChanges {

  private static GLOBAL_ID = 0;

  public currentImage: IImageIndex | null = null;

  private readonly id: number;
  @Input() private sliderImages: (IImageIndex | null)[] = [null, null, null];
  @Input() private currentImageIndex: number = 0;

  constructor(private animationService: AnimationService) {
    this.id = SliderImageComponent.GLOBAL_ID;
    ++SliderImageComponent.GLOBAL_ID;
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

  /**
   * Close the slider if you click on the black area
   */
  public close($event: MouseEvent): void {
    if ($event.target === $event.currentTarget) {
      this.animationService.animateTo('down');
    }
  }

  /**
   * Update the current image if changes get registered
   */
  public ngOnChanges(): void {
    this.currentImage = this.getImageModulo();
  }

  /**
   * Get always the same image from the image range
   */
  private getImageModulo(): IImageIndex | null {
    for (const image of this.sliderImages) {
      if (image && image.index % 3 === this.id) {
        return image;
      }
    }
    return null;
  }
}
