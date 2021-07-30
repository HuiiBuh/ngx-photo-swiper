import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { isResponsiveImage } from '../../../helpers';
import { ImageWithIndex, SliderImageIndex } from '../../../models/gallery';
import { LightboxStore } from '../../../store/lightbox.store';
import { Position, WidthHeight } from '../slider/animation.models';

/** @dynamic */
@Component({
  selector: 'photo-slider-image[sliderImages][currentImageIndex]',
  templateUrl: './slider-image.component.html',
  styleUrls: ['./slider-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderImageComponent implements OnDestroy, OnInit, AfterViewInit {

  private static GLOBAL_ID = 0;
  private static IMAGES_IN_SLIDER: (SliderImageIndex | null | undefined)[] = new Array(3);

  public currentImage: ImageWithIndex | null = null;
  public largeImageVisible: boolean = false;
  public captionHeight: string = '0';
  public stretchConfig: WidthHeight<string> = {height: 'auto', width: 'auto'};
  public right: string = '';
  @ViewChild('caption') public caption: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('smallCaption') public smallCaption: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('captionWrapper') public captionWrapper: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('largeImage') public largeImage: ElementRef<HTMLImageElement> | undefined;

  @Input() public currentImageIndex: number | undefined;
  @ViewChild('imageCenter') private imageCenter!: ElementRef<HTMLDivElement>;
  private readonly id: number;
  private resizeSubscription!: () => void;
  public mouseDownStart: number = 0;

  constructor(
    private store: LightboxStore,
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {
    this.id = SliderImageComponent.GLOBAL_ID;
    SliderImageComponent.GLOBAL_ID += 1;
  }

  @Input()
  public set sliderImages(value: (ImageWithIndex | null)[] | undefined) {
    if (!value) return;

    this.setOrUpdateImage(value);
    this.updateCaptionText();
    this.stretchConfig = this.getStretchConfig();
    this.right = this.getRight();
  }

  public ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.resizeSubscription = this.renderer.listen('window', 'resize', () => {
        const newConfig = this.getStretchConfig();

        // Nothing changed
        if (newConfig.height === this.stretchConfig.height && newConfig.width === this.stretchConfig.width) return;

        // Update stretch config
        this.stretchConfig = newConfig;
        this.cd.detectChanges();
      });
    });

  }

  public ngAfterViewInit(): void {
    this.updateCaptionText();
  }

  public ngOnDestroy(): void {
    SliderImageComponent.GLOBAL_ID -= 1;
    this.resizeSubscription();
  }

  /**
   * Get the index of the image
   */
  public getImageIndex(): number {
    let returnIndex = 0;

    if (this.currentImage && this.currentImageIndex !== undefined) {
      returnIndex = ((this.currentImage.index - (this.currentImageIndex % 3) + 1) % 3);
      if (returnIndex < 0) {
        returnIndex += 3;
      }
    }

    return returnIndex;
  }

  /**
   * Close the slider if you click on the black area
   */
  public close(event: MouseEvent): void {
    if (event.timeStamp - this.mouseDownStart > 100) return;
    if (event.target === event.currentTarget || event.target === this.imageCenter.nativeElement) {
      this.store.animateTo('close');
    }
  }

  /**
   * Calculate the scrollbar-width and the icon width
   */
  private getRight(): string {
    const window = this.document.defaultView;
    let scrollbarWidth = 0;
    if (window) scrollbarWidth = window.innerWidth - this.document.body.clientWidth;
    if (isNaN(scrollbarWidth)) scrollbarWidth = 0;
    return `calc(5vw + 32px + ${scrollbarWidth}px)`;
  }

  /**
   * Calculate the stretch config for the images
   */
  private getStretchConfig(): { width: string; height: string } {
    const image = this.currentImage;

    const window = this.document.defaultView;
    if (!image || !isResponsiveImage(image) || !window) {
      return {height: 'auto', width: 'auto'};
    }

    const height = image.height / window.innerHeight;
    const width = image.width / window.innerWidth;

    if (height < width) return {height: 'auto', width: '100%'};
    return {height: '100%', width: 'auto'};
  }

  private setOrUpdateImage(value: (ImageWithIndex | null)[]): void {
    let image = value.find(i => i?.index === this.currentImage?.index);
    if (!image && !this.currentImage) {
      image = value[this.id];
    } else if (!image) {
      const indexList = SliderImageComponent.IMAGES_IN_SLIDER.map(i => i?.index);
      image = value.filter(i => !indexList.includes(i?.index))[0];
    }

    SliderImageComponent.IMAGES_IN_SLIDER[this.id] = image;
    this.currentImage = image;
  }

  public updateCaptionText(): void {
    if (!this.currentImage?.caption && this.currentImage?.smallCaption && this.captionWrapper) {
      this.captionWrapper.nativeElement.style.display = 'none';
      return;
    }

    if (this.captionWrapper) {
      this.captionWrapper.nativeElement.style.display = 'block';
    }
    if (this.currentImage?.caption && this.caption) {
      this.caption.nativeElement.innerText = this.currentImage.caption;
    }
    if (this.currentImage?.smallCaption && this.smallCaption) {
      this.smallCaption.nativeElement.innerText = this.currentImage.smallCaption;
    }

    // Give the elements time to adjust
    setTimeout(() => {
      const height = this.getCaptionHeight();

      if (this.imageCenter) {
        this.imageCenter.nativeElement.style.bottom = `${height}px`;
      }
    }, 0);
  }

  public getCaptionHeight(): number {
    if (!this.captionWrapper) return 0;
    return this.captionWrapper.nativeElement.clientHeight;
  }

  public getImagePosition(): Position<number> | null {
    if (!this.largeImage) return null;

    return this.largeImage.nativeElement.getBoundingClientRect();
  }
}
