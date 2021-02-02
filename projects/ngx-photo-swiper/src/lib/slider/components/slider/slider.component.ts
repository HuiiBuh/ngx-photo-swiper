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
import { ControlsComponent } from '../controls/controls.component';
import { SliderService } from '../../services/slider.service';
import { TouchMove } from '../../directives/touchmove.directive.event';
import { AnimationService } from './animation.service';
import { changeImage, openClose } from './slider.animation';

// @dynamic
@Component({
  selector: 'photo-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['slider.component.scss'],
  animations: [
    changeImage,
    openClose,
  ],
})
export class SliderComponent implements OnInit, OnDestroy {


  @Input() public controls: TemplateRef<ControlsComponent> | null = null;
  public display: 'block' | 'none' = 'none';
  public animate: THorizontal = 'current';
  public startPosition: string = '0px';
  public sliderState!: SliderInformation;
  public hAnimationInProgress = false;

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
    private animationService: AnimationService,
    @Inject(DOCUMENT) private document: Document) {
  }

  public ngOnInit(): void {
    this.animationServiceSubscription = this.animationService.animateTo$.subscribe(this.handleAnimationRequest.bind(this));
    this.sliderStateSubscription = this.store.getDisplayedImages().subscribe(v => this.sliderState = v);
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
        this.animateImageChange($event.getDirection() as HDirection);
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
    this.hAnimationInProgress = false;
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
    if ($event.state === 'start' || $event.state === 'move') {
      this.scheduleAnimation(() => {
        this.setTranslate(0, $event.current.y - $event.start.y);
        this.setOpacity((300 - Math.abs($event.current.y - $event.start.y)) / 300);
        this.inTranslate = false;
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
      requestAnimationFrame(callback);
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

  /**
   * Animate the transition to another image
   * @param direction The direction the transition should go to
   */
  private animateImageChange(direction: HDirection): void {
    const imageIndex = this.sliderState?.slider?.imageIndex;
    if (imageIndex === 0 && direction === 'left' ||
      imageIndex === this.sliderState.gallerySize - 1 && direction === 'right') {
      this.animate = 'none';
      this.animate = 'none';
    } else if (!this.hAnimationInProgress) {
      this.animate = direction;
    }
  }

  /**
   * Handle animation requests
   * @param animation The animation direction
   */
  private handleAnimationRequest(animation: TAnimation): void {
    if (animation === 'right' || animation === 'left') {
      this.animateImageChange(animation);
    } else if (animation === 'up' || animation === 'down') {
      this.sliderService.closeSlider();
    } else if (animation === 'none') {
      this.animateImageChange(animation);
    }
  }
}
