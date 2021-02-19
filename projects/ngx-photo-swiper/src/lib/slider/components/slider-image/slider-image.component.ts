import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ImageIndex } from '../../../models/gallery';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'photo-slider-image[sliderImages][currentImageIndex]',
  templateUrl: './slider-image.component.html',
  styleUrls: ['./slider-image.component.scss'],
})
export class SliderImageComponent implements OnChanges, OnDestroy {

  private static GLOBAL_ID = 0;
  public currentImage: ImageIndex | null = null;
  public largeImageVisible: boolean = false;

  private readonly id: number;
  @Input() private sliderImages: (ImageIndex | null)[] = [null, null, null];
  @Input() private currentImageIndex: number = 0;

  constructor(private animationService: AnimationService) {
    this.id = SliderImageComponent.GLOBAL_ID;
    SliderImageComponent.GLOBAL_ID += 1;
  }

  public ngOnDestroy(): void {
    SliderImageComponent.GLOBAL_ID -= 1;
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
  public ngOnChanges(changes: SimpleChanges): void {
    this.currentImage = this.getImageModulo();
  }

  /**
   * Get always the same image from the image range
   */
  private getImageModulo(): ImageIndex | null {
    for (const image of this.sliderImages) {
      if (image && image.index % 3 === this.id) {
        return image;
      }
    }
    return null;
  }
}
