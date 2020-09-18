import {animate, state, style, transition, trigger} from '@angular/animations';
import {DOCUMENT} from '@angular/common';
import {Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
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
  animations: [
    trigger('toNext', [
      state('current', style({
        transform: 'translate3D({{ startPosition }},0,0)',
      }), {params: {startPosition: '0'}}),
      state('next', style({
        transform: 'translate3d(calc(-100vw - 30px), 0px, 0px)',
      })),
      transition('current => next', [
        animate('333ms cubic-bezier(0.4, 0, 0.22, 1)'),
      ]),
    ]),
  ],
})

export class SliderComponent implements OnInit, OnDestroy {

  @ViewChild('slider')
  private slider: ElementRef | undefined;

  private galleryStateSubscription!: Subscription;

  public galleryState!: GalleryState;
  public currentImageIndex: number = 0;
  public imageRange: (IImageIndex | null)[] = [];
  private swipeEvent: TouchMove | undefined;
  public animateNext: 'current' | 'next' = 'current';

  public animationInProgress: boolean = false;
  private startPosition: string = '0px';


  constructor(
    private lightboxService: NgxLightboxService,
    public sliderService: SliderService,
    private store: LightboxStore,
    private renderer2: Renderer2,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document) {
    console.log('fuck');
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

  /**
   * Get the index of the image
   */
  public getImageIndex(x: number): number {
    return ((x - (this.currentImageIndex % 3) + 1) % 3);
  }

  /**
   * Get always the same image
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
    switch ($event.state) {
      case 'start':
        this.swipeEvent = $event;
        this.followTouchGesture();
        break;
      case 'move':
        this.swipeEvent = $event;
        break;
      case 'end':
        this.swipeEvent = undefined;
        this.ngZone.run(() => this.animateNext = 'next');
        break;
    }
  }

  private followTouchGesture(): void {
    if (!this.swipeEvent || this.swipeEvent.state === 'end') {
      return;
    }

    this.setTranslate(this.swipeEvent.current.x - this.swipeEvent.start.x, 0);

    requestAnimationFrame(this.followTouchGesture.bind(this));
  }

  private setTranslate(x: number, y: number): void {
    this.renderer2.setStyle(this.slider?.nativeElement, 'transform', `translate3d(${x}px,${y}px,0)`);
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

  public end(): void {
    this.animationInProgress = false;
    this.ngZone.run(() => this.animateNext = 'current');
  }

  public getSliderPosition(): string {
    if (!this.animationInProgress) {
      if (this.slider?.nativeElement) {
        const transform = getComputedStyle(this.slider?.nativeElement).transform;
        this.startPosition = `${new WebKitCSSMatrix(transform).m41}px`;
      }
    }

    console.log(this.startPosition);
    return this.startPosition;
  }
}
