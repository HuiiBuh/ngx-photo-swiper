import {animate, state, style, transition, trigger} from '@angular/animations';
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
  ViewChild
} from '@angular/core';
import {Subscription} from 'rxjs';
import {GalleryState, IImage} from '../../ngx-lightbox.interfaces';
import {NgxLightboxService} from '../../ngx-lightbox.service';
import {LightboxStore} from '../../store/lightbox.store';
import {ControlsComponent} from '../controls/controls.component';
import {SliderService} from '../slider.service';
import {AnimationService} from './animation.service';
import {HDirection, TAnimation, THorizontal} from './slider.types';
import {TouchMove} from './touchmove/touchmove.event';

interface IImageIndex extends IImage {
  index: number;
}

@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['slider.component.scss'],
  animations: [
    trigger('toNext', [
      state('current', style({
        transform: 'translate3D({{ startPosition }},0,0)',
      }), {params: {startPosition: '0'}}),
      state('right', style({
        transform: 'translate3d(calc(-100vw - 30px), 0px, 0px)',
      })),
      state('left', style({
        transform: 'translate3d(calc(100vw + 30px), 0px, 0px)',
      })),
      state('none', style({
        transform: 'translate3d(0, 0px, 0px)',
      })),
      transition('current => right', [
        animate('333ms cubic-bezier(0, 0, 0, 1)'),
      ]),
      transition('current => left', [
        animate('333ms cubic-bezier(0, 0, 0, 1)'),
      ]),
      transition('current => none', [
        animate('333ms cubic-bezier(0, 0, 0, 1)'),
      ]),
    ])
  ],
})
export class SliderComponent implements OnInit, OnDestroy {


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

  @Input()
  controls: TemplateRef<ControlsComponent> | null = null;

  @ViewChild('slider')
  private slider: ElementRef | undefined;

  private animationServiceSubscription!: Subscription;
  private galleryStateSubscription!: Subscription;
  private inTranslate = false;

  public galleryState!: GalleryState;
  public currentImageIndex: number = 0;
  public imageRange: (IImageIndex | null)[] = [];

  public animate: THorizontal = 'current';
  public startPosition: string = '0';

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
   * Get the index of the image
   */
  public getImageIndex(x: number): number {
    return ((x - (this.currentImageIndex % 3) + 1) % 3);
  }

  /**
   * Get always the same image from the image range
   * @param x The modulo solution
   */
  public getImageModulo(x: number): IImageIndex | null {
    for (const image of this.imageRange) {
      if (image && image.index % 3 === x) {
        return image;
      }
    }
    return null;
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
