import {DOCUMENT} from '@angular/common';
import {Component, HostListener, Inject, Input} from '@angular/core';
import {SliderService} from '../slider.service';

@Component({
  selector: 'lib-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent {

  @Input() position = true;
  @Input() zoom = true;
  @Input() fullscreen = true;
  @Input() share = true;
  @Input() close = true;
  @Input() arrows = true;

  // Should the controls be visible
  public controlsVisible: boolean = true;
  // Is the website in fullscreen mode
  public fullscreenEnabled: boolean = false;
  // Timeout for the controls
  private controlsVisibleTimeout: number = 0;

  constructor(
    public sliderService: SliderService,
    @Inject(DOCUMENT) private document: Document) {
  }


  /**
   * Show the controls if the mouse is in the window
   */
  @HostListener('document:mouseenter')
  showControls(): void {
    this.controlsVisible = true;
    clearTimeout(this.controlsVisibleTimeout);
  }

  /**
   * Hide the controls if the mouse leaves
   */
  @HostListener('document:mouseleave')
  hideControls(): void {
    if (!this.isMobile()) {
      this.controlsVisibleTimeout = setTimeout(() => this.controlsVisible = false, 500);
    }
  }

  /**
   * Listen for the key events and adapt the slider
   * @param event The key events
   */
  @HostListener('document:keyup', ['$event'])
  catchKeyboardEvents(event: KeyboardEvent): void {

    // Prevent event from registering twice
    event.stopImmediatePropagation();
    if (event.key === 'ArrowRight') {
      this.sliderService.nextPicture();
    } else if (event.key === 'ArrowLeft') {
      this.sliderService.previousPicture();
    } else if (event.key === 'Escape') {
      this.sliderService.closeSlider();
    }
  }

  /**
   * Listen to fullscreen changes
   */
  @HostListener('window:fullscreenchange', ['$event'])
  fullscreenChange(): void {
    this.fullscreenEnabled = !!this.document.fullscreenElement;
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
    } else {
      return false;
    }
  }


}
