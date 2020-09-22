import {DOCUMENT} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {Subscription} from 'rxjs';
import {GalleryState} from '../../ngx-lightbox.interfaces';
import {NgxLightboxService} from '../../ngx-lightbox.service';
import {LightboxStore} from '../../store/lightbox.store';
import {ControlsComponent} from '../controls/controls.component';
import {IImageIndex} from '../slider-interfaces';
import {SliderService} from '../slider.service';
import {TouchMove} from '../touchmove/touchmove.event';
import {AnimationService} from './animation.service';
import {changeImage, openClose} from './slider.animation';
import {HDirection, TAnimation, THorizontal} from './slider.types';


@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['slider.component.scss'],
  animations: [
    changeImage,
    openClose,
  ],
})
export class SliderComponent implements OnInit, OnDestroy {


  @Input()
  controls: TemplateRef<ControlsComponent> | null = null;
  public galleryState!: GalleryState;
  public currentImageIndex: number = 0;
  public imageRange: (IImageIndex | null)[] = [];
  public display: 'block' | 'none' = 'none';
  public animate: THorizontal = 'current';
  public startPosition: string = '0';
  @ViewChild('slider')
  private slider: ElementRef | undefined;
  private animationServiceSubscription!: Subscription;
  private galleryStateSubscription!: Subscription;
  private inTranslate = false;

  constructor(
    private lightboxService: NgxLightboxService,
    public sliderService: SliderService,
    private store: LightboxStore,
    private renderer2: Renderer2,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private animationService: AnimationService,
    @Inject(DOCUMENT) private document: Document) {
  }

  public ngOnInit(): void {
    this.galleryStateSubscription = this.store.state$.subscribe(this.populateData.bind(this));
    this.animationServiceSubscription = this.animationService.animateTo$.subscribe(this.handleAnimationRequest.bind(this));
  }

  /**
   * Unsubscribe from active subscriptions
   */
  public ngOnDestroy(): void {
    this.galleryStateSubscription.unsubscribe();
  }

  /**
   * Handle the horizontal swipe and hide the image
   * @param $event The horizontal swipe event
   */
  public async horizontalSwipe($event: TouchMove): Promise<void> {
    if ($event.state === 'start' || $event.state === 'move') {
      this.scheduleAnimation(() => {
        this.setTranslate($event.current.x - $event.start.x, 0);
        this.inTranslate = false;
      });
    } else {
      this.ngZone.run(() => {
        this.updateStartPosition();
        this.changeDetectorRef.detectChanges();
        this.animateTransition($event.getDirection() as HDirection);
      });
    }
  }

  /**
   * Actually switch to the next image after the animation
   */
  public changeImage(): void {
    if (this.animate !== 'current') {
      if (this.animate === 'left') {
        this.sliderService.previousPicture();
      } else if (this.animate === 'right') {
        this.sliderService.nextPicture();
      }
      this.startPosition = '0px';
      this.animate = 'current';
    }
  }

  /**
   * Get the current position of the slider
   */
  public updateStartPosition(): void {
    if (this.slider?.nativeElement) {
      const transform = getComputedStyle(this.slider?.nativeElement).transform;
      this.startPosition = `${new WebKitCSSMatrix(transform).m41}px`;
    }
  }

  /**
   * Handle the vertical swipe and hide the image
   * @param $event The vertical swipe event
   */
  public verticalSwipe($event: TouchMove): void {
    console.log($event);
  }

  public close($event: MouseEvent): void {
    if ($event.target === $event.currentTarget) {
      this.sliderService.closeSlider();
    }
  }

  /**
   * Schedule the animation with request animation frame
   * @param callback The function which should be called if the time is right
   */
  private scheduleAnimation(callback: () => void): void {
    if (!this.inTranslate) {
      this.inTranslate = true;
      requestAnimationFrame(callback);
    }
  }

  /**
   * Set the translate of the slider
   */
  private setTranslate(x: number, y: number): void {
    this.renderer2.setStyle(this.slider?.nativeElement, 'transform', `translate3d(${x}px,${y}px,0)`);
  }

  /**
   * Animate the transition to another image
   * @param direction The direction the transition should go to
   */
  private animateTransition(direction: HDirection): void {
    if (this.currentImageIndex === 0 && direction === 'left' ||
      this.currentImageIndex === this.galleryState.gallery[this.galleryState.slider.gridID].length - 1 && direction === 'right') {
      this.animate = 'none';
      this.animate = 'none';
    } else {
      this.animate = direction;
    }
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
   * Handle animation requests
   * @param animation The animation direction
   */
  private handleAnimationRequest(animation: TAnimation): void {
    if (animation === 'right' || animation === 'left') {
      this.animateTransition(animation);
    } else if (animation === 'up' || animation === 'down') {
      // TODO
    } else if (animation === 'none') {
      this.animateTransition(animation);
    }
  }
}
