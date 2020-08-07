import {DOCUMENT} from '@angular/common';
import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {GalleryState} from '../../ngx-lightbox.interfaces';
import {NgxLightboxService} from '../../ngx-lightbox.service';
import {LightboxStore} from '../../store/lightbox.store';
import {SliderService} from '../slider.service';

@Component({
  selector: 'lib-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  private visibleTimeout: number = 0;
  private sliderSubscription!: Subscription;

  public visible: boolean = true;
  public galleryState!: GalleryState;
  public fullscreen: boolean = false;

  constructor(
    public lightboxService: NgxLightboxService,
    public sliderService: SliderService,
    private store: LightboxStore,
    @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    this.sliderSubscription = this.store.state$.subscribe(value => this.galleryState = value);
  }

  @HostListener('document:mouseenter')
  showControls(): void {
    this.visible = true;
    clearTimeout(this.visibleTimeout);
  }

  @HostListener('document:mouseleave')
  hideControls(): void {
    this.visibleTimeout = setTimeout(() => this.visible = false, 1000);
  }

  @HostListener('document:keydown', ['$event'])
  movePicture(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      this.sliderService.nextPicture();
    } else if (event.key === 'ArrowLeft') {
      this.sliderService.previousPicture();
    }
  }

  @HostListener('window:keyup', ['$event.key'])
  bindEscape(key: string): void {
    if (key === 'Escape') {
      this.store.closeSlider();
    }
  }

  @HostListener('window:fullscreenchange', ['$event'])
  fullscreenChange(): void {
    this.fullscreen = !!this.document.fullscreenElement;
  }

  public async toggleFullscreen(): Promise<void> {
    if (!this.fullscreen) {
      await this.document.body.requestFullscreen();
    } else {
      await this.document.exitFullscreen();
    }
  }
}
