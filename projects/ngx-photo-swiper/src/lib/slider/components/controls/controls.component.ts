import { animate, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  TemplateRef,
} from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LightboxStore } from '../../../store/lightbox.store';

// @dynamic
@Component({
  selector: 'photo-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class ControlsComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() public position = true;
  // TODO implement zoom
  public zoom = false;
  @Input() public fullscreen = true;
  @Input() public share = true;
  @Input() public close = true;
  @Input() public arrows = true;
  @Input() public download = true;
  @Input() public shareOptionList: TemplateRef<HTMLAnchorElement[]> | undefined;
  @Input() public fadeoutTime = 3000;
  @Input() public showOnMobile = true;
  @Input() public disableFadeout = false;

  // Should the controls be visible
  public controlsVisible: boolean = true;
  public active$!: Observable<boolean>;
  public imageIndex$!: Observable<number>;
  public sliderLength$!: Observable<number>;
  public isLastImage$!: Observable<boolean>;
  public isFirstImage$!: Observable<boolean>;
  public hasInfiniteSwipe$!: Observable<boolean>;
  public currentImage$!: Observable<string>;

  // Is the website in fullscreen mode
  public fullscreenEnabled: boolean = false;
  public display: 'block' | 'none' = 'block';

  // Timeout for the controls
  private controlsVisibleTimeout: number = 0;
  private destroy$ = new Subject<boolean>();

  constructor(
    public store: LightboxStore,
    private ngZone: NgZone,
    private renderer2: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object) {
  }

  /**
   * Add a listener which listens for mouse move events and hides the controls if the mouse stands still
   */
  public ngOnInit(): void {
    this.imageIndex$ = this.store.getImageIndex$();
    this.sliderLength$ = this.store.getSliderLength$();
    this.currentImage$ = this.store.largestSrcOfImage$();
    this.active$ = this.store.getIsActive$();
    this.isLastImage$ = this.store.getIsLastImage$();
    this.isFirstImage$ = this.store.getIsFirstImage$();
    this.hasInfiniteSwipe$ = this.store.getHasInfiniteSwipe$();

    this.ngZone.runOutsideAngular(() => {
      fromEvent(this.document.body, 'mousemove').pipe(takeUntil(this.destroy$))
        .subscribe(this.handleComponentVisibility.bind(this));
      fromEvent(this.document.body, 'click').pipe(takeUntil(this.destroy$))
        .subscribe(this.handleComponentVisibility.bind(this));
    });
    this.handleComponentVisibility();
  }

  public ngAfterViewInit(): void {
    this.addListeners();
  }

  /**
   * Remove the mouse listener
   */
  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
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
   * Add the listeners for left, right, escape and scroll
   */
  private addListeners(): void {
    fromEvent<KeyboardEvent>(this.document, 'keyup').pipe(takeUntil(this.destroy$))
      .subscribe(e => {
        switch (e.key) {
          case 'ArrowLeft':
            this.store.animateTo('left');
            break;
          case 'ArrowRight':
            this.store.animateTo('right');
            break;
          case 'Escape':
            this.store.animateTo('close');
        }
      });
    fromEvent(this.document, 'scroll', {once: true}).pipe(takeUntil(this.destroy$))
      .subscribe(() => this.store.animateTo('close'));
    fromEvent(this.document, 'fullscreenchange').pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fullscreenEnabled = !!this.document.fullscreenElement;
        this.changeDetectorRef.detectChanges();
      });
  }

  /**
   * Handle the visibility. This method gets called every time the user moves his mouse
   */
  private handleComponentVisibility(): void {

    // Check if the fadeout is disabled or if the code is run on the server side.
    // If run on the server side don't use the timeout, because this would result in the server waiting 3 seconds
    if (this.disableFadeout || !isPlatformBrowser(this.platformId)) return;

    // Check if the controls are not visible and if so set them to visible
    if (!this.controlsVisible) {
      this.ngZone.run(() => {
        this.controlsVisible = true;
        this.changeDetectorRef.detectChanges();
      });
    }

    // Clear the fade out timeout
    clearTimeout(this.controlsVisibleTimeout);

    // Hide the controls after a certain amount of time
    if (!this.isMobile() && !this.store.state.slider.shareVisible) {
      this.controlsVisibleTimeout = setTimeout(() => {
        if (this.controlsVisible) {
          this.ngZone.run(() => this.controlsVisible = false);
          this.changeDetectorRef.detectChanges();
        }
      }, this.fadeoutTime) as unknown as number;
    }
  }
}
