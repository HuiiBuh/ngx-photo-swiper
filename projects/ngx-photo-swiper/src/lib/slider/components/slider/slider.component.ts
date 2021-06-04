import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
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
  ViewChildren,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SliderInformation } from '../../../models/gallery';
import { HDirection, TAnimation } from '../../../models/slider';
import { LightboxStore } from '../../../store/lightbox.store';
import { TouchMove } from '../../directives/touchmove.directive.event';
import { ControlsComponent } from '../controls/controls.component';
import { SliderImageComponent } from '../slider-image/slider-image.component';
import { AnimationProps, DEFAULT_IMAGE_CHANGE_FACTORY, DEFAULT_OPEN_CLOSE_FACTORY } from './slider.animation';

// @dynamic
@Component({
  selector: 'photo-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['slider.component.scss'],
})
export class SliderComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public controls: TemplateRef<ControlsComponent> | null = null;
  public sliderState!: SliderInformation;

  @ViewChild('slider') private slider: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('lightboxContainer') private lightboxContainer: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('sliderOverlay') private sliderOverlay: ElementRef<HTMLDivElement> | undefined;
  @ViewChildren(SliderImageComponent) private sliderImages: SliderImageComponent[] = [];

  private inTranslate = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: LightboxStore,
    private renderer2: Renderer2,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document) {
  }

  public ngOnInit(): void {
    this.store.getAnimationRequest$().pipe(takeUntil(this.destroy$))
      .subscribe(this.handleAnimationRequest.bind(this));
    this.store.getSliderImages$().pipe(takeUntil(this.destroy$))
      .subscribe(v => this.sliderState = v);
  }

  public ngAfterViewInit(): void {
    this.resetSlider();
  }

  /**
   * Unsubscribe from active subscriptions
   */
  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Handle the horizontal swipe and hide the image
   * @param $event The horizontal swipe event
   */
  public horizontalSwipe($event: TouchMove): void {
    if ($event.state === 'start' || $event.state === 'move') {
      this.scheduleAnimation(() => this.setTranslate($event.current.clientX - $event.start.clientX, 0));
    } else {
      this.ngZone.run(() => this.handleAnimationRequest($event.getDirection() as HDirection));
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
        const direction = $event.getDirection() as 'open' | 'close' | 'none';
        if (direction === 'none') {
          // TODO smooth transition back
          this.setTranslate(0, 0);
          this.setOpacity(1);
        } else {
          this.handleAnimationRequest(direction);
        }
      });
    }
  }

  /**
   * Reset opacity, translate and the display state
   */
  public resetSlider(): void {
    this.sliderState.slider.active ? this.setDisplay('block') : this.setDisplay('none');
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

  private getImageElements(): AnimationProps {
    this.setDisplay('block');
    const currentImage = this.store.getCurrentImage();

    let galleryImage: HTMLImageElement | null = null;
    if (currentImage && currentImage.nativeImage) galleryImage = currentImage.nativeImage;

    return {
      galleryImage,
      sliderImage: null // TODO create an image which handles the image transitioning
    };
  }

  /**
   * Set the translate of the slider
   */
  private setTranslate(x: number, y: number): void {
    this.renderer2.setStyle(this.slider?.nativeElement, 'transform', `translate3d(${x}px,${y}px,0)`);
  }

  /**
   * Set the opacity on the overlay
   * @param opacity The opacity value (0 - 1)
   */
  private setOpacity(opacity: number): void {
    this.renderer2.setStyle(this.sliderOverlay?.nativeElement, 'opacity', `${opacity}`);
  }

  /**
   * Change the display value of the lightboxContainer
   * @param display The display property
   */
  private setDisplay(display: 'none' | 'block'): void {
    if (this.lightboxContainer) {
      this.renderer2.setStyle(this.lightboxContainer?.nativeElement, 'display', display);
    }
  }

  /**
   * Animate back to the center
   */
  private hAnimateCenter(): void {
    const animationProps = this.getImageElements();
    const blueprint = DEFAULT_IMAGE_CHANGE_FACTORY.center(animationProps!);

    if (this.slider) {
      const animation: Animation = this.slider.nativeElement.animate(blueprint.keyframe, blueprint.options);
      animation.onfinish = () => this.resetSlider();
    }
  }

  /**
   * Animate to the left side
   */
  private hAnimateLeft(): void {
    const animationProps = this.getImageElements();
    const blueprint = DEFAULT_IMAGE_CHANGE_FACTORY.left(animationProps!);

    if (this.slider) {
      const animation = this.slider.nativeElement.animate(blueprint.keyframe, blueprint.options);
      animation.onfinish = () => {
        this.resetSlider();
        this.store.moveImageIndex(-1);
        this.cd.detectChanges();
      };
    }
  }

  /**
   * Animate to the right side
   */
  private hAnimateRight(): void {
    const animationProps = this.getImageElements();
    const blueprint = DEFAULT_IMAGE_CHANGE_FACTORY.right(animationProps!);
    if (this.slider) {
      const animation = this.slider.nativeElement.animate(blueprint.keyframe, blueprint.options);
      animation.onfinish = () => {
        this.resetSlider();
        this.store.moveImageIndex(1);
        this.cd.detectChanges();
      };
    }

  }

  /**
   * Animate the slider until he is visible
   */
  private vAnimateOpen(): void {
    this.setDisplay('block');

    const animationImages = this.getImageElements();
    const {background, image} = DEFAULT_OPEN_CLOSE_FACTORY.open(animationImages);

    if (this.lightboxContainer) {
      const animation: Animation = this.lightboxContainer.nativeElement.animate(background.keyframe, background.options);
      animation.onfinish = () => this.resetSlider();
    }
    if (animationImages.sliderImage) {
      animationImages.sliderImage.animate(image.keyframe, image.options);
    }
  }

  /**
   * Animate the slider until he is hidden
   */
  private vAnimateClosed(): void {
    const animationImages = this.getImageElements();

    const {background, image} = DEFAULT_OPEN_CLOSE_FACTORY.close(animationImages);

    if (this.lightboxContainer) {
      const animation: Animation = this.lightboxContainer.nativeElement.animate(background.keyframe, background.options);
      animation.onfinish = () => {
        this.setDisplay('none');
        this.store.closeSlider();
        this.setTranslate(0, 0);
        this.setOpacity(1);
      };
    }

    if (animationImages.sliderImage) {
      animationImages.sliderImage.animate(image.keyframe, image.options);
    }
  }

  /**
   * Handle animation requests and distribute the request to the appropriate animation method
   * @param animation The animation direction
   */
  private handleAnimationRequest(animation: TAnimation): void {
    console.log(animation);
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
      case 'close':
        this.vAnimateClosed();
        break;
      case 'open':
        this.vAnimateOpen();
        break;
      default:
        console.error(`${animation} was not found`);
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
