import { DOCUMENT } from '@angular/common';
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
import { Subscription } from 'rxjs';
import { SliderInformation } from '../../../models/gallery';
import { HDirection, TAnimation, THorizontal } from '../../../models/slider';
import { LightboxStore } from '../../../store/lightbox.store';
import { TouchMove } from '../../directives/touchmove.directive.event';
import { SliderService } from '../../services/slider.service';
import { ControlsComponent } from '../controls/controls.component';
import { openClose } from './slider.animation';

interface AnimationReturn {
  keyframe: Keyframe[] | PropertyIndexedKeyframes | null;
  options?: (number | KeyframeAnimationOptions);
}

interface ImageAnimationFactory {
  right(): AnimationReturn;

  left(): AnimationReturn;

  center(): AnimationReturn;
}

const DEFAULT_OPTIONS = {
  duration: 200,
  easing: 'cubic-bezier(0, 0, 0, 1)'
};

const changeImageAnimationFactory: ImageAnimationFactory = {
  right: () => ({
    keyframe: [{transform: 'translate3d(-110vw, 0, 0)'}],
    options: DEFAULT_OPTIONS
  }),
  left: () => ({
    keyframe: [{transform: 'translate3d(110vw, 0, 0)'}],
    options: DEFAULT_OPTIONS
  }),
  center: () => ({
    keyframe: [{transform: 'translate3d(0, 0, 0)'}],
    options: DEFAULT_OPTIONS
  }),

};

// @dynamic
@Component({
  selector: 'photo-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['slider.component.scss'],
  animations: [
    openClose,
  ],
})
export class SliderComponent implements OnInit, OnDestroy {

  @Input() public controls: TemplateRef<ControlsComponent> | null = null;
  public display: 'block' | 'none' = 'none';
  public animate: THorizontal = 'current';
  public startPosition: string = '0px';
  public sliderState!: SliderInformation;

  @ViewChild('slider') private slider: ElementRef | undefined;
  @ViewChild('sliderOverlay') private sliderOverlay: ElementRef | undefined;
  private inTranslate = false;
  private animationServiceSubscription!: Subscription;
  private sliderStateSubscription!: Subscription;

  constructor(
    public sliderService: SliderService,
    private store: LightboxStore,
    private renderer2: Renderer2,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document) {
  }

  public ngOnInit(): void {
    this.animationServiceSubscription = this.store.getAnimation$().subscribe(this.handleAnimationRequest.bind(this));
    this.sliderStateSubscription = this.store.sliderImages$.subscribe(v => this.sliderState = v);
  }

  /**
   * Unsubscribe from active subscriptions
   */
  public ngOnDestroy(): void {
    this.sliderStateSubscription.unsubscribe();
    this.animationServiceSubscription.unsubscribe();
  }

  /**
   * Handle the horizontal swipe and hide the image
   * @param $event The horizontal swipe event
   */
  public horizontalSwipe($event: TouchMove): void {
    if ($event.state === 'start' || $event.state === 'move') {
      this.scheduleAnimation(() => {
        this.setTranslate($event.current.clientX - $event.start.clientX, 0);
      });
    } else {
      this.ngZone.run(() => {
        this.updateStartPosition();
        this.changeDetectorRef.detectChanges();
        this.handleAnimationRequest($event.getDirection() as HDirection);
      });
    }
  }

  /**
   * Handle the vertical swipe and hide the image
   * @param $event The vertical swipe event
   */
  public verticalSwipe($event: TouchMove): void {
    if ($event.state === 'start' || $event.state === 'move') {
      this.scheduleAnimation(() => {
        this.setTranslate(0, $event.current.clientY - $event.start.clientY);
        this.setOpacity((300 - Math.abs($event.current.clientY - $event.start.clientY)) / 300);
      });
    } else {
      this.ngZone.run(() => {
        const direction = $event.getDirection() as 'up' | 'down' | 'none';
        if (direction === 'none') {
          this.setTranslate(0, 0);
          this.setOpacity(1);
        } else {
          this.sliderService.closeSlider();
        }
      });
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
   * Reset opacity, translate and the display state
   */
  public afterOpenClose(): void {
    this.display = this.sliderState.slider.active ? 'block' : 'none';
    this.setTranslate(0, 0);
    this.setOpacity(1);
  }

  /**
   * Schedule the animation with request animation frame
   * @param callback The function which should be called if the time is right
   */
  private scheduleAnimation(callback: () => void): void {
    if (!this.inTranslate) {
      this.inTranslate = true;
      requestAnimationFrame(() => {
        callback();
        this.inTranslate = false;
      });
    }
  }

  /**
   * Set the translate of the slider
   */
  private setTranslate(x: number, y: number): void {
    this.renderer2.setStyle(this.slider?.nativeElement, 'transform', `translate3d(${x}px,${y}px,0)`);
  }

  private setOpacity(opacity: number): void {
    this.renderer2.setStyle(this.sliderOverlay?.nativeElement, 'opacity', `${opacity}`);
  }

  private hAnimateCenter(): void {
    const blueprint = changeImageAnimationFactory.center();
    this.slider?.nativeElement.animate(blueprint.keyframe, blueprint.options);
  }

  private hAnimateLeft(): void {
    const blueprint = changeImageAnimationFactory.left();
    const animation = this.slider?.nativeElement.animate(blueprint.keyframe, blueprint.options);
    animation.onfinish = () => {
      this.sliderService.previousPicture();
      this.setTranslate(0, 0);
      this.changeDetectorRef.detectChanges();
    };
  }

  private hAnimateRight(): void {
    const blueprint = changeImageAnimationFactory.right();
    const animation = this.slider?.nativeElement.animate(blueprint.keyframe, blueprint.options);
    animation.onfinish = () => {
      this.sliderService.nextPicture();
      this.setTranslate(0, 0);
      this.changeDetectorRef.detectChanges();
    };
  }

  /**
   * Handle animation requests
   * @param animation The animation direction
   */
  private handleAnimationRequest(animation: TAnimation): void {
    switch (animation) {
      case 'left':
        this.shouldChangeImage(animation) && this.hAnimateLeft();
        break;
      case 'right':
        this.shouldChangeImage(animation) && this.hAnimateRight();
        break;
      case 'none':
        this.hAnimateCenter();
        break;
      case 'down' || 'up':
        this.sliderService.closeSlider();
    }
  }

  /**
   * Checks if an image change should be initiated or if the image change would cause an overflow (first to last image)
   * @param direction The direction of the image change
   */
  private shouldChangeImage(direction: 'right' | 'left'): boolean {
    const imageIndex = this.sliderState?.slider?.imageIndex;
    const gallery = this.store.state.gallery[this.store.state.slider.lightboxID];
    if (!gallery) return false;

    return !(
      /*If infinite swipe is on dont check the other conditions */!gallery.infiniteSwipe &&
      // If infinite swipe is off check if ...
      (
        // The image index would get negative
        imageIndex === 0 && direction === 'left' ||
        // The image index would get larger as the total images in the gallery
        imageIndex === this.sliderState.gallerySize - 1 && direction === 'right'
      )
    );
  }
}
