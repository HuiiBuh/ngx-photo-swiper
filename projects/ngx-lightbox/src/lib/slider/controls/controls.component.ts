import {animate, state, style, transition, trigger} from '@angular/animations';
import {DOCUMENT} from '@angular/common';
import {Component, HostListener, Inject, Input} from '@angular/core';
import {ShareService} from '../share/share.service';
import {TShareOptionList} from '../slider-interfaces';
import {SliderService} from '../slider.service';
import {AnimationService} from '../slider/animation.service';

@Component({
  selector: 'lib-controls',
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
export class ControlsComponent {

  @Input() position = true;
  @Input() zoom = true;
  @Input() fullscreen = true;
  @Input() share = true;
  @Input() close = true;
  @Input() arrows = true;
  @Input() shareOptionList: TShareOptionList = [];
  @Input() fadeoutTime: number = 1000;
  @Input() showOnMobile: boolean = true;

  // Should the controls be visible
  public controlsVisible: boolean = true;

  // Is the website in fullscreen mode
  public fullscreenEnabled: boolean = false;
  public displayState: string = 'block';
  // Timeout for the controls
  private controlsVisibleTimeout: number = 0;

  constructor(
    public sliderService: SliderService,
    private shareService: ShareService,
    private animationService: AnimationService,
    @Inject(DOCUMENT) private document: Document) {
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
   * Close the slider after exiting the fullscreen
   */
  async closeSlider(): Promise<void> {
    if (this.fullscreenEnabled) {
      await this.document.exitFullscreen();
    }

    this.sliderService.closeSlider();
  }

  /**
   * Check if the browser is a mobile browser
   */
  public isMobile(): boolean {
    if (this.document.defaultView) {
      return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.document.defaultView.navigator.userAgent));
    } else {
      return false;
    }
  }

  public toggleShareView(event: MouseEvent): void {
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.shareService.shareVisible.next(!this.shareService.shareVisible.value);
  }

  /**
   * Show the controls if the mouse is in the window
   */
  @HostListener('body:mouseenter')
  showControls(): void {
    this.controlsVisible = true;
    clearTimeout(this.controlsVisibleTimeout);
  }

  /**
   * Hide the controls if the mouse leaves
   */
  @HostListener('body:mouseleave')
  hideControls(): void {
    if (!this.isMobile() && !this.shareService.shareVisible.value) {
      this.controlsVisibleTimeout = setTimeout(() => this.controlsVisible = false, this.fadeoutTime);
    }
  }

  /**
   * Listen to fullscreen changes
   */
  @HostListener('window:fullscreenchange', ['$event'])
  fullscreenChange(): void {
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
  public async e(): Promise<void> {
    await this.closeSlider();
  }
}
