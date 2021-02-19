import { animate, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input, NgZone, OnDestroy, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { AnimationService } from '../../services/animation.service';
import { ShareService } from '../../services/share.service';
import { SliderService } from '../../services/slider.service';

// @dynamic
@Component({
  selector: 'photo-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['controls.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('visible', style({
        opacity: 1,
      })),
      state('hidden', style({
        opacity: 0,
      })),
      transition('visible <=> hidden', [
        animate('333ms cubic-bezier(0.4, 0, 0.22, 1)'),
      ]),
    ]),
  ],
})
export class ControlsComponent implements OnInit, OnDestroy {

  @Input() public position = true;
  // TODO implement zoom
  public zoom = false;
  @Input() public fullscreen = true;
  @Input() public share = true;
  @Input() public close = true;
  @Input() public arrows = true;
  @Input() public shareOptionList: TemplateRef<HTMLAnchorElement[]> | undefined;
  @Input() public fadeoutTime: number = 3000;
  @Input() public showOnMobile: boolean = true;

  // Should the controls be visible
  public controlsVisible: boolean = true;

  // Is the website in fullscreen mode
  public fullscreenEnabled: boolean = false;
  public displayState: string = 'block';

  // Timeout for the controls
  private controlsVisibleTimeout: number = 0;
  private listeners: (() => void)[] = [];

  constructor(
    public sliderService: SliderService,
    public shareService: ShareService,
    private animationService: AnimationService,
    private ngZone: NgZone,
    private renderer2: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document) {
  }

  /**
   * Add a listener which listens for mouse move events and hides the controls if the mouse stands still
   */
  public ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const listener = this.renderer2.listen('body', 'mousemove', this.handleComponentVisibility.bind(this));
      this.listeners.push(listener);
    });
    this.handleComponentVisibility();
    this.addListeners();
  }

  /**
   * Remove the mouse listener
   */
  public ngOnDestroy(): void {
    this.listeners.forEach(l => l());
    this.listeners = [];
  }

  /**
   * Toggle fullscreen of the gallery
   */
  public async toggleFullscreen(): Promise<void> {
    if (!this.fullscreenEnabled) {
      await this.document.body.requestFullscreen();
    } else {
      await this.document.exitFullscreen();
    }
  }

  /**
   * Check if the browser is a mobile browser
   */
  public isMobile(): boolean {
    if (this.document.defaultView) {
      return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.document.defaultView.navigator.userAgent));
    }
    return false;
  }

  public left(): void {
    this.animationService.animateTo('left');
  }

  public right(): void {
    this.animationService.animateTo('right');
  }

  public closeSlider(): void {
    this.animationService.animateTo('down');
  }

  /**
   * Add the listeners for left, right, escape and scroll
   */
  private addListeners(): void {
    const listener1 = this.renderer2.listen(this.document, 'keyup', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.left();
          break;
        case 'ArrowRight':
          this.right();
          break;
        case 'Escape':
          this.closeSlider();
          break;
        default:
      }
    });
    this.document.addEventListener('scroll', () => this.closeSlider(), {once: true});
    const listener3 = this.renderer2.listen(this.document, 'fullscreenchange', () => {
      this.fullscreenEnabled = !!this.document.fullscreenElement;
    });
    this.listeners.push(listener1,  listener3);
  }

  /**
   * Handle the visibility. This method gets called every time the user moves his mouse
   */
  private handleComponentVisibility(): void {
    // Check if the controls are not visible and if so set them to visible
    if (!this.controlsVisible) {
      this.ngZone.run(() => this.controlsVisible = true);
    }

    // Clear the fade out timeout
    clearTimeout(this.controlsVisibleTimeout);

    // Hide the controls after a certain amount of time
    if (!this.isMobile() && !this.shareService.visible) {
      this.controlsVisibleTimeout = setTimeout(() => {
        if (this.controlsVisible) {
          this.ngZone.run(() => this.controlsVisible = false);
        }
      }, this.fadeoutTime) as unknown as number;
    }
  }

}
