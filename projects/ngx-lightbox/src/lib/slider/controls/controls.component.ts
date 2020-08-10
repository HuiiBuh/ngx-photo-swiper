import {DOCUMENT} from '@angular/common';
import {Component, HostListener, Inject, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {GalleryState} from '../../ngx-lightbox.interfaces';
import {NgxLightboxService} from '../../ngx-lightbox.service';
import {LightboxStore} from '../../store/lightbox.store';
import {SliderService} from '../slider.service';

@Component({
  selector: 'lib-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {

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
  // State values
  public galleryState: GalleryState | undefined;
  // Timeout for the controls
  private controlsVisibleTimeout: number = 0;
  private gallerySubscription!: Subscription;

  constructor(
    public lightboxService: NgxLightboxService,
    public sliderService: SliderService,
    private store: LightboxStore,
    @Inject(DOCUMENT) private document: Document) {
  }


  ngOnInit(): void {
    this.gallerySubscription = this.store.state$.subscribe(value => this.galleryState = value);
    console.log(this.arrows);
  }

  @HostListener('document:mouseenter')
  showControls(): void {
    this.controlsVisible = true;
    clearTimeout(this.controlsVisibleTimeout);
  }

  @HostListener('document:mouseleave')
  hideControls(): void {
    if (!this.isMobile()) {
      this.controlsVisibleTimeout = setTimeout(() => this.controlsVisible = false, 500);
    }
  }

  @HostListener('document:keyup', ['$event'])
  catchKeyboardEvents(event: KeyboardEvent): void {

    // Prevent event from registering twice
    event.stopImmediatePropagation();
    if (event.key === 'ArrowRight') {
      this.sliderService.nextPicture();
    } else if (event.key === 'ArrowLeft') {
      this.sliderService.previousPicture();
    } else if (event.key === 'Escape') {
      this.store.closeSlider();
    }
  }

  @HostListener('window:fullscreenchange', ['$event'])
  fullscreenChange(): void {
    this.fullscreenEnabled = !!this.document.fullscreenElement;
  }

  public async toggleFullscreen(): Promise<void> {
    if (!this.fullscreenEnabled) {
      await this.document.body.requestFullscreen();
    } else {
      await this.document.exitFullscreen();
    }
  }

  public isMobile(): boolean {
    if (this.document.defaultView) {
      return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.document.defaultView.navigator.userAgent));
    } else {
      return false;
    }
  }

}
