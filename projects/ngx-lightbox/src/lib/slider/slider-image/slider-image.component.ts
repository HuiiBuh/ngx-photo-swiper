import {Component, Input} from '@angular/core';
import {IImageIndex} from '../slider-interfaces';
import {AnimationService} from '../slider/animation.service';

@Component({
  selector: 'lib-slider-image[sliderImages][currentImageIndex]',
  templateUrl: './slider-image.component.html',
  styleUrls: ['./slider-image.component.scss'],
})
export class SliderImageComponent {

  private static GLOBAL_ID = 0;
  private readonly id: number;

  @Input() private sliderImages: (IImageIndex | null)[] = [null, null, null];
  @Input() private currentImageIndex: number = 0;

  constructor(private animationService: AnimationService) {
    this.id = SliderImageComponent.GLOBAL_ID;
    ++SliderImageComponent.GLOBAL_ID;
    console.log(SliderImageComponent.GLOBAL_ID);
  }

  /**
   * Get always the same image from the image range
   */
  public getImageModulo(): IImageIndex | null {
    for (const image of this.sliderImages) {
      if (image && image.index % 3 === this.id) {
        return image;
      }
    }
    return null;
  }


  /**
   * Get the index of the image
   */
  public getImageIndex(): number {
    return ((this.id - (this.currentImageIndex % 3) + 1) % 3);
  }

  public close($event: MouseEvent): void {
    if ($event.target === $event.currentTarget) {
      this.animationService.animateTo('down');
    }
  }
}
