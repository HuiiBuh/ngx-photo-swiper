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
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SliderInformation } from '../../../models/gallery';
import { HDirection, TAnimation } from '../../../models/slider';
import { LightboxStore } from '../../../store/lightbox.store';
import { TouchMove } from '../../directives/touchmove.directive.event';
import { SliderService } from '../../services/slider.service';
import { ControlsComponent } from '../controls/controls.component';
import { DEFAULT_IMAGE_CHANGE_FACTORY, DEFAULT_OPEN_CLOSE_FACTORY } from './slider.animation';

// @dynamic
@Component({
  selector: 'photo-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['slider.component.scss'],
})
export class SliderComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() public controls: TemplateRef<ControlsComponent> | null = null;
  public display: 'block' | 'none' = 'none';
  public sliderState!: SliderInformation;

  @ViewChild('slider') private slider: ElementRef | undefined;
  @ViewChild('lightboxContainer') private lightboxContainer: ElementRef | undefined;
  @ViewChild('sliderOverlay') private sliderOverlay: ElementRef | undefined;
  private inTranslate = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public sliderService: SliderService,
    private store: LightboxStore,
    private renderer2: Renderer2,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document) {
  }

  public ngOnInit(): void {
    this.store.getAnimation$().pipe(takeUntil(this.destroy$)).subscribe(this.handleAnimationRequest.bind(this));
    this.store.sliderImages$.pipe(takeUntil(this.destroy$)).subscribe(v => this.sliderState = v);
    this.store.onChanges<boolean>('slider', 'active').subscribe(e => {
      this.handleAnimationRequest(e ? 'up' : 'down');
    });
  }

  public ngAfterViewInit(): void {
    this.afterOpenClose();
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
        const direction = $event.getDirection() as 'up' | 'down' | 'none';
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
  public afterOpenClose(): void {
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
    this.renderer2.setStyle(this.lightboxContainer?.nativeElement, 'display', display);
  }

  /**
   * Animate back to the center
   */
  private hAnimateCenter(): void {
    const blueprint = DEFAULT_IMAGE_CHANGE_FACTORY.center();
    if (this.slider) {
      const animation = this.slider.nativeElement.animate(blueprint.keyframe, blueprint.options);
      animation.onfinish = () => {
        this.setTranslate(0, 0);
      };
    }
  }

  /**
   * Animate to the left side
   */
  private hAnimateLeft(): void {
    const blueprint = DEFAULT_IMAGE_CHANGE_FACTORY.left();
    const animation = this.slider?.nativeElement.animate(blueprint.keyframe, blueprint.options);
    animation.onfinish = () => {
      this.sliderService.previousPicture();
      this.setTranslate(0, 0);
      this.cd.detectChanges();
    };
  }

  /**
   * Animate to the right side
   */
  private hAnimateRight(): void {
    const blueprint = DEFAULT_IMAGE_CHANGE_FACTORY.right();
    const animation = this.slider?.nativeElement.animate(blueprint.keyframe, blueprint.options);
    animation.onfinish = () => {
      this.sliderService.nextPicture();
      this.setTranslate(0, 0);
      this.cd.detectChanges();
    };
  }

  private vAnimateOpen(): void {
    const blueprint = DEFAULT_OPEN_CLOSE_FACTORY.open();

    if (this.slider) {
      const animation = this.slider.nativeElement.animate(blueprint);
      animation.onfinish = () => {
        this.afterOpenClose();
      };
    }
  }

  private vAnimateClosed(): void {
    const blueprint = DEFAULT_OPEN_CLOSE_FACTORY.close();

    if (this.slider) {
      const animation = this.slider.nativeElement.animate(blueprint);
      animation.onfinish = () => {
        this.afterOpenClose();
        this.sliderService.closeSlider();
      };
    }
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
      case 'down':
        this.vAnimateClosed();
        break;
      case 'up':
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
