import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy } from '@angular/core';
import { ImageWithIndex, ResponsiveSliderImageIndex } from '../../../models/gallery';
import { AnimationService } from '../../services/animation.service';

/** @dynamic */
@Component({
  selector: 'photo-slider-image[sliderImages][currentImageIndex]',
  templateUrl: './slider-image.component.html',
  styleUrls: ['./slider-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderImageComponent implements OnDestroy {

  private static GLOBAL_ID = 0;
  public currentImage: ImageWithIndex | null = null;
  public largeImageVisible: boolean = false;

  public readonly id: number;
  @Input() private currentImageIndex: number = 0;

  constructor(private animationService: AnimationService, @Inject(DOCUMENT) private document: Document) {
    this.id = SliderImageComponent.GLOBAL_ID;
    SliderImageComponent.GLOBAL_ID += 1;
  }

  @Input()
  private set sliderImages(value: (ImageWithIndex | null)[]) {
    this.currentImage = value[this.id];
  }

  public ngOnDestroy(): void {
    SliderImageComponent.GLOBAL_ID -= 1;
  }

  /**
   * Close the slider if you click on the black area
   */
  public close($event: MouseEvent): void {
    if ($event.target === $event.currentTarget) {
      this.animationService.animateTo('down');
    }
  }

  public getHeight(captionHeight: number): string {
    //                   top                    caption top   caption bottom
    return `calc(100vh - 44px - ${captionHeight}px - 1rem - .5rem)`;
  }

  public loadEnd(): void {
    this.largeImageVisible = true;
  }

  public getStretchConfig(): { width: string; height: string } {
    const image = this.currentImage as ResponsiveSliderImageIndex;

    if (image.width === undefined || image.height === undefined) return {height: 'auto', width: 'auto'};

    const window = this.document.defaultView;
    if (!window) return {height: 'auto', width: '100%'};

    const height = image.height / window.innerHeight;
    const width = image.width / window.innerWidth;

    if (height < width) return {height: 'auto', width: '100%'};
    return {height: '100%', width: 'auto'};
  }

  public getRight(): string {
    const window = this.document.defaultView;
    let scrollbarWidth = 0;
    if (window) scrollbarWidth = window.innerWidth - this.document.body.clientWidth;
    return `calc(5vw + 32px + ${scrollbarWidth}px)`;
  }
}
