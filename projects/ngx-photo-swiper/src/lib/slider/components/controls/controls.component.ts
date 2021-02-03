import { animate, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Input, NgZone, OnDestroy, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { SliderService } from '../../services/slider.service';
import { ShareService } from '../share/share.service';
import { AnimationService } from '../slider/animation.service';

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
  private mouseMoveListenerSubscription: (() => void) | undefined;

  constructor(
    public sliderService: SliderService,
    public shareService: ShareService,
    private animationService: AnimationService,
    private ngZone: NgZone,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document) {
  }

  /**
   * Add a listener which listens for mouse move events and hides the controls if the mouse stands still
   */
  public ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.mouseMoveListenerSubscription = this.renderer2.listen('body', 'mousemove', this.handleComponentVisibility.bind(this));
    });
    this.handleComponentVisibility();
  }

  /**
   * Remove the mouse listener
   */
  public ngOnDestroy(): void {
    if (this.mouseMoveListenerSubscription) {
      this.mouseMoveListenerSubscription();
    }
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

  /**
   * Listen to fullscreen changes
   */
  @HostListener('window:fullscreenchange', ['$event'])
  public fullscreenChange(): void {
    this.fullscreenEnabled = !!this.document.fullscreenElement;
  }

  @HostListener('document:keyup.arrowRight')
  public r(): void {
    this.animationService.animateTo('right');
  }

  @HostListener('document:keyup.arrowLeft')
  public l(): void {
    this.animationService.animateTo('left');
  }

  @HostListener('document:scroll')
  @HostListener('document:keyup.escape')
  public e(): void {
    this.sliderService.closeSlider();
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
      }, this.fadeoutTime);
    }
  }

}
