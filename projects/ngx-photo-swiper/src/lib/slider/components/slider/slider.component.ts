import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { animationsFinished, isResponsiveImage } from '../../../helpers';
import { SliderInformation } from '../../../models/gallery';
import { HDirection, TAnimation } from '../../../models/slider';
import { LightboxStore } from '../../../store/lightbox.store';
import { TouchMove } from '../../directives/touchmove.directive.event';
import { ControlsComponent } from '../controls/controls.component';
import { SliderImageComponent } from '../slider-image/slider-image.component';
import { AnimationProps, OpenCloseAnimation, WidthHeight } from './animation.models';
import { DEFAULT_IMAGE_CHANGE_FACTORY } from './change-animation';
import { DEFAULT_OPEN_CLOSE_FACTORY } from './open-animation';

// @dynamic
@Component({
  selector: 'photo-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public controls: TemplateRef<ControlsComponent> | null = null;
  public sliderState$!: Observable<SliderInformation>;

  @ViewChild('slider') private slider: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('animationOverlay') private animationOverlay: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('sliderOverlay') private sliderOverlay: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('animationImage') private animationImage: ElementRef<HTMLImageElement> | undefined;
  @ViewChild('sliderWrapper') private sliderWrapper: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('controlsWrapper') private controlsWrapper: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('animationComponents') private animationComponents: ElementRef<HTMLDivElement> | undefined;
  @ViewChildren(SliderImageComponent) private sliderImages: SliderImageComponent[] = [];

  private inTranslate = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: LightboxStore,
    private renderer2: Renderer2,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  public ngOnInit(): void {
    this.sliderState$ = this.store.getSliderImages$();
  }

  public ngAfterViewInit(): void {
    this.store.getAnimationRequest$().pipe(takeUntil(this.destroy$)).subscribe(this.handleAnimationRequest.bind(this));
    this.sliderVisible(this.store.getIsActive(), false);
  }

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
   * Reset opacity, translate
   */
  public resetSlider(): void {
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
   * Get the image elements which should be used for animations
   */
  private getImageElements(): AnimationProps {
    const currentImage = this.store.getCurrentImage();

    let galleryImage: HTMLImageElement | null = null;
    if (currentImage && currentImage.nativeImage) galleryImage = currentImage.nativeImage;

    return {
      galleryImage,
      animationImage: this.animationImage ? this.animationImage.nativeElement : null
    };
  }

  /**
   * Set the translate of the slider
   */
  private setTranslate(x: number, y: number): void {
    if (this.slider) {
      this.renderer2.setStyle(this.slider.nativeElement, 'transform', `translate3d(${x}px,${y}px,0)`);
    }
  }

  /**
   * Set the opacity on the overlay
   * @param sliderOpacity The opacity value (0 - 1)
   */
  private setOpacity(sliderOpacity: number): void {
    if (this.sliderOverlay) {
      this.renderer2.setStyle(this.sliderOverlay.nativeElement, 'opacity', `${sliderOpacity}`);
    }
    if (this.controlsWrapper) {
      const controlsOpacity = sliderOpacity < 0.7 ? 0 : 1;
      this.renderer2.setStyle(this.controlsWrapper.nativeElement, 'opacity', `${controlsOpacity}`);
    }
  }

  /**
   * Change the visibility of the slider and the visibility of the animation elements.
   * By default the animation elements are always hidden if the slider is visible
   * @param sliderVisible The slider visibility
   * @param animationVisible The visibility of the animation elements (opposite of slider if not provided)
   */
  private sliderVisible(sliderVisible: boolean, animationVisible = !sliderVisible): void {
    if (this.sliderWrapper) {
      this.renderer2.setStyle(this.sliderWrapper.nativeElement, 'display', sliderVisible ? 'block' : 'none');
      this.renderer2.setStyle(this.sliderWrapper.nativeElement, 'pointer-events', sliderVisible ? 'all' : 'none');
    }

    if (this.animationComponents) {
      this.renderer2.setStyle(this.animationComponents.nativeElement, 'display', animationVisible ? 'block' : 'none');
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
  private async hAnimateLeft(): Promise<void> {
    const animationProps = this.getImageElements();
    const blueprint = DEFAULT_IMAGE_CHANGE_FACTORY.left(animationProps!);

    if (this.slider) {
      const animation = this.slider.nativeElement.animate(blueprint.keyframe, blueprint.options);
      await animationsFinished([animation]);
      this.resetSlider();
      this.store.moveImageIndex(-1);
      this.cd.detectChanges();
    }
  }

  private getCenteredImage(): SliderImageComponent | undefined {
    return this.sliderImages.find(i => i.getImageIndex() === 1);
  }

  /**
   * Animate to the right side
   */
  private async hAnimateRight(): Promise<void> {
    const animationProps = this.getImageElements();
    const blueprint = DEFAULT_IMAGE_CHANGE_FACTORY.right(animationProps!);
    if (this.slider) {
      const animation = this.slider.nativeElement.animate(blueprint.keyframe, blueprint.options);
      await animationsFinished([animation]);
      this.resetSlider();
      this.store.moveImageIndex(1);
      this.cd.detectChanges();
    }
  }

  /**
   * Animate the slider until he is visible
   */
  private async vAnimateOpen(): Promise<void> {
    const imageSize = this.getImageSize();
    const windowSize = this.getWindowSize();
    const animationImages = this.getImageElements();

    const imageRange = this.store.getSliderImages();
    this.sliderImages.forEach(i => {
      i.sliderImages = imageRange.imageRange;
      i.currentImageIndex = imageRange.slider.imageIndex;
    });

    const centeredImage = this.getCenteredImage();
    let captionHeight: number | null = null;
    if (centeredImage) {
      centeredImage.updateCaptionText();
      captionHeight = centeredImage.getCaptionHeight();
    }

    const animation = DEFAULT_OPEN_CLOSE_FACTORY.open(animationImages, imageSize, windowSize, captionHeight);

    await this.vAnimate(animation);

    this.sliderVisible(true);
    this.resetSlider();
  }

  /**
   * Animate the slider until he is hidden
   */
  private async vAnimateClosed(): Promise<void> {
    const imageSize = this.getImageSize();
    const windowSize = this.getWindowSize();
    const animationImages = this.getImageElements();
    const opacity = this.getCurrentOpacity();

    const centeredImage = this.getCenteredImage();
    let captionHeight: number | null = null;
    if (centeredImage) {
      captionHeight = centeredImage.getCaptionHeight();
    }

    const animation = DEFAULT_OPEN_CLOSE_FACTORY.close(animationImages, imageSize, windowSize, captionHeight, opacity);

    await this.vAnimate(animation);

    this.sliderVisible(false, false);
    this.store.closeSlider();
    this.resetSlider();
  }

  /**
   * Execute the passed animation
   */
  private async vAnimate(animation: OpenCloseAnimation): Promise<void> {
    const animationList: Animation[] = [];
    if (animation.canAnimateImage) {
      this.sliderVisible(false);
      const backgroundAnimation =
        this.animationOverlay!.nativeElement.animate(animation.background.keyframe, animation.background.options);
      const imageAnimation = this.animationImage!.nativeElement.animate(animation.image.keyframe, animation.image.options);
      animationList.push(imageAnimation, backgroundAnimation);
    } else if (this.sliderWrapper) {
      this.sliderVisible(true);
      const sliderAnimation =
        this.sliderWrapper.nativeElement.animate(animation.background.keyframe, animation.background.options);
      animationList.push(sliderAnimation);
    }
    await animationsFinished(animationList);
  }

  /**
   * Get the size of the currently centered image
   */
  private getImageSize(): null | WidthHeight {
    const image = this.store.getCenterImage();
    if (!image || !isResponsiveImage(image)) return null;

    return {width: image.width, height: image.height};
  }

  /**
   * Get the window size if available
   */
  private getWindowSize(): null | WidthHeight {
    const window = this.document.defaultView;
    if (!window) return null;

    const scrollbarWidth = window.innerWidth - this.document.body.clientWidth;
    return {
      width: window.innerWidth - scrollbarWidth,
      height: window.innerHeight
    };
  }

  /**
   * Handle animation requests and distribute the request to the appropriate animation method
   * @param animation The animation direction
   */
  private async handleAnimationRequest(animation: TAnimation): Promise<void> {
    switch (animation) {
      case 'left':
        this.shouldChangeImage(animation) && await this.hAnimateLeft();
        break;
      case 'right':
        this.shouldChangeImage(animation) && await this.hAnimateRight();
        break;
      case 'none':
        this.hAnimateCenter();
        break;
      case 'close':
        await this.vAnimateClosed();
        break;
      case 'open':
        await this.vAnimateOpen();
        break;
      default:
        console.error(`${animation} was not found`);
    }
  }

  /**
   * Get the opacity of the background overlay
   */
  private getCurrentOpacity(): number {
    if (this.sliderOverlay) {
      const tmp = parseInt(this.sliderOverlay.nativeElement.style.opacity, 0);
      if (isNaN(tmp)) return 1;
      return tmp;
    }
    return 1;
  }

  /**
   * Checks if an image change should be initiated or if the image change would cause an overflow (first to last image)
   * @param direction The direction of the image change
   */
  private shouldChangeImage(direction: 'right' | 'left'): boolean {
    const imageIndex = this.store.getImageIndex();
    const gallery = this.store.state.gallery[this.store.state.slider.lightboxID];
    if (!gallery) return false;

    return !(
      /*If infinite swipe is on dont check the other conditions */!gallery.infiniteSwipe &&
      // If infinite swipe is off check if ...
      (
        // The image index would get negative
        imageIndex === 0 && direction === 'left' ||
        // The image index would get larger as the total images in the gallery
        imageIndex === this.store.getSliderGallerySize() - 1 && direction === 'right'
      )
    );
  }
}
