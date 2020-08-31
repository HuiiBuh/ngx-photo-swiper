import {DOCUMENT} from '@angular/common';
import {Component, DoCheck, ElementRef, Inject, NgZone, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {GalleryState, IImage} from '../../ngx-lightbox.interfaces';
import {NgxLightboxService} from '../../ngx-lightbox.service';
import {LightboxStore} from '../../store/lightbox.store';
import {SliderService} from '../slider.service';
import {TouchMove} from './touchmove.directive';

interface IImageIndex extends IImage {
  index: number;
}

@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit, OnDestroy, DoCheck {

  @ViewChild('slider') slider: ElementRef | undefined;
  public galleryState!: GalleryState;
  public imageRange: (IImageIndex | null)[] = [];

  public currentImageIndex: number = 0;
  private galleryStateSubscription!: Subscription;
  private blockingChange: boolean = false;

  constructor(
    private lightboxService: NgxLightboxService,
    public sliderService: SliderService,
    private store: LightboxStore,
    private renderer2: Renderer2,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document) {
  }

  public ngOnInit(): void {
    this.galleryStateSubscription = this.store.state$.subscribe(this.populateData.bind(this));
  }

  /**
   * Unsubscribe from active subscriptions
   */
  public ngOnDestroy(): void {
    this.galleryStateSubscription.unsubscribe();
  }

  public ngDoCheck(): void {
    console.log('change detection');
  }

  /**
   * Handle the horizontal swipe and hide the image
   * @param $event The horizontal swipe event
   */
  public horizontalSwipe($event: TouchMove): void {
    if (!$event.finished) {
      this.timeAnimation(this.moveImage.bind(this, $event.start.x - $event.current.x));
    } else {
      this.transitionToImage($event);
    }
  }

  /**
   * Handle the vertical swipe and hide the image
   * @param $event The vertical swipe event
   */
  public verticalSwipe($event: TouchMove): void {
    console.log($event);
  }

  /**
   * Get the index of the image
   */
  public getImageIndex(x: number): number {
    return ((x - (this.currentImageIndex % 3) + 1) % 3);
  }

  /**
   * Fill in the important data from the gallery state
   * @param value The new gallery state
   */
  private populateData(value: GalleryState): void {
    if (value.slider.active) {

      const images = value.gallery[value.slider.gridID];
      this.currentImageIndex = value.slider.imageIndex;

      const imageList: (IImageIndex | null)[] = new Array(3);

      for (const i of [-1, 0, 1]) {
        const image = images[this.currentImageIndex + i];
        if (image) {
          imageList[i + 1] = {
            ...images[this.currentImageIndex + i],
            index: this.currentImageIndex + i,
          };
        } else {
          imageList[i + 1] = null;
        }
      }

      this.imageRange = imageList;
    }

    this.galleryState = value;
  }

  /**
   * Move the image according to the touch
   * @param translatePixel How many pixel the image should be moved
   */
  private moveImage(translatePixel: number): void {
    this.renderer2.setStyle(this.slider?.nativeElement, 'transform', `translate(${-translatePixel}px, -50%)`);
    this.blockingChange = false;
  }

  /**
   * Transition to an image
   * @param touchMove The touch with the start and the current position
   */
  private transitionToImage(touchMove: TouchMove): void {
    const difference = touchMove.start.x - touchMove.current.x;

    // Percentage of the touch
    const movePercentage = Math.abs(difference) / this.document.body.clientWidth;
    if (movePercentage > .3) {
      if (difference > 0) {
        this.ngZone.run(this.sliderService.nextPicture.bind(this));
      } else {
        this.ngZone.run(this.sliderService.previousPicture.bind(this));
      }
    } else {
      // If you move the whole slider you have to move it back with requestAnimationFrame() until the left is back to zero
    }
  }

  /**
   * Time the animation
   * @param callback The callback which should be timed
   */
  private timeAnimation(callback: () => void): void {
    if (!this.blockingChange) {
      requestAnimationFrame(callback);
    }
    this.blockingChange = true;
  }
}
