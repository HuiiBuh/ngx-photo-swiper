import { animate, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Input, TemplateRef } from '@angular/core';
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
export class ControlsComponent {

  @Input() public position = true;
  // TODO implement zoom
  public zoom = false;
  @Input() public fullscreen = true;
  @Input() public share = true;
  @Input() public close = true;
  @Input() public arrows = true;
  @Input() public shareOptionList: TemplateRef<HTMLAnchorElement[]> | undefined;
  @Input() public fadeoutTime: number = 1000;
  @Input() public showOnMobile: boolean = true;

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
  public closeSlider(): void {
    this.sliderService.closeSlider();
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

  public toggleShareView(event: MouseEvent): void {
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.shareService.toggle();
  }

  /**
   * Show the controls if the mouse is in the window
   */
  @HostListener('body:mouseenter')
  public showControls(): void {
    this.controlsVisible = true;
    clearTimeout(this.controlsVisibleTimeout);
  }

  /**
   * Hide the controls if the mouse leaves
   */
  @HostListener('body:mouseleave')
  public hideControls(): void {
    if (!this.isMobile() && !this.shareService.visible) {
      this.controlsVisibleTimeout = setTimeout(() => this.controlsVisible = false, this.fadeoutTime);
    }
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
}
