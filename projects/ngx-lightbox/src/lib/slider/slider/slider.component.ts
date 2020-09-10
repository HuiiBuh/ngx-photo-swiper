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

// TODO move the slider animation into a angular animation
@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit, OnDestroy, DoCheck {

  private static readonly movementSpeed = 50;
  private static _slider: ElementRef | undefined;
  public galleryState!: GalleryState;
  public imageRange: (IImageIndex | null)[] = [];
  public currentImageIndex: number = 0;
  private galleryStateSubscription!: Subscription;
  private blockingChange: boolean = false;
  private hSwipeOffset: number = 0;

  constructor(
    private lightboxService: NgxLightboxService,
    public sliderService: SliderService,
    private store: LightboxStore,
    private renderer2: Renderer2,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document) {
  }

  get slider(): ElementRef | undefined {
    return SliderComponent._slider;
  }

  @ViewChild('slider')
  set slider(value: ElementRef | undefined) {
    if (value) {
      SliderComponent._slider = value;
    }
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
   * Get the index of the image
   */
  public getImageIndex(x: number): number {
    return ((x - (this.currentImageIndex % 3) + 1) % 3);
  }

  /**
   * Handle the horizontal swipe and hide the image
   * @param $event The horizontal swipe event
   */
  public async horizontalSwipe($event: TouchMove): Promise<void> {
    this.hSwipeOffset = $event.start.x - $event.current.x;
    if (!$event.finished) {
      this.timeAnimation(this.moveImage.bind(this));
    } else {
      await this.transitionToImage($event);
    }
  }

  public getImageModulo(x: number): IImageIndex | null {
    for (const image of this.imageRange) {
      if (image && image.index % 3 === x) {
        return image;
      }
    }
    return null;
  }

  /**
   * Handle the vertical swipe and hide the image
   * @param $event The vertical swipe event
   */
  public verticalSwipe($event: TouchMove): void {
    console.log($event);
  }

  animatePrevious(callback: () => void): void {
    const bodyWidth = this.document.body.clientWidth + 46;

    const getNewPosition = () => {
      const newPosition = this.hSwipeOffset - SliderComponent.movementSpeed;
      if (newPosition <= -bodyWidth) {
        return -bodyWidth;
      }
      return newPosition;
    };

    const previousAnimation = () => {
      if (this.hSwipeOffset > -bodyWidth) {
        this.hSwipeOffset = getNewPosition();
        this.moveImage();
        requestAnimationFrame(previousAnimation.bind(this));
      } else {
        callback();
      }
    };

    previousAnimation();
  }

  animateNext(callback: () => void): void {
    const bodyWidth = this.document.body.clientWidth + 46;

    const getNewPosition = () => {
      const newPosition = this.hSwipeOffset + SliderComponent.movementSpeed;
      if (newPosition > bodyWidth) {
        return bodyWidth;
      }
      return newPosition;
    };

    const nextAnimation = () => {
      if (this.hSwipeOffset < bodyWidth) {
        this.hSwipeOffset = getNewPosition();
        this.moveImage();
        requestAnimationFrame(nextAnimation.bind(this));
      } else {
        callback();
      }
    };

    nextAnimation();
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
    this.hSwipeOffset = 0;
    this.moveImage();
  }

  /**
   * Move the image according to the touch
   */
  private moveImage(): void {
    if (this.slider?.nativeElement) {
      this.renderer2.setStyle(this.slider.nativeElement, 'transform', `translate3d(${-this.hSwipeOffset}px,0 ,0)`);
    }
    this.blockingChange = false;
  }

  /**
   * Transition to an image
   * @param touchMove The touch with the start and the current position
   */
  private async transitionToImage(touchMove: TouchMove): Promise<void> {
    const difference = touchMove.start.x - touchMove.current.x;

    // Percentage of the touch
    const movePercentage = Math.abs(difference) / this.document.body.clientWidth;
    if (movePercentage > .2 || Math.abs(difference) > 100) {
      if (difference > 0) {
        this.animateNext(() => {
          this.ngZone.run(this.sliderService.nextPicture.bind(this));
        });
      } else {
        this.animatePrevious(() => {
          this.ngZone.run(this.sliderService.previousPicture.bind(this));
        });

      }
    } else {
      await this.animateResetPosition();
    }
  }

  /**
   * Reset the image slider to its original position
   * TODO reset if you swipe to wide at the first or last image
   */
  private async animateResetPosition(): Promise<void> {
    const factor = this.hSwipeOffset > 0 ? -1 : 1;

    const getNewPosition = () => {
      const newPosition = this.hSwipeOffset + factor * SliderComponent.movementSpeed;
      if (newPosition * factor > 0) {
        return 0;
      }
      return newPosition;
    };

    const resetAnimation = () => {
      if (this.hSwipeOffset * factor < 0) {
        this.hSwipeOffset = getNewPosition();
        this.moveImage();
        requestAnimationFrame(resetAnimation.bind(this));
      }
    };

    resetAnimation();
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
