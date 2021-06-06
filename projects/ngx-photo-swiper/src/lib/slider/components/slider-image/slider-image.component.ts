import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageWithIndex, ResponsiveSliderImageIndex, SliderImageIndex } from '../../../models/gallery';
import { LightboxStore } from '../../../store/lightbox.store';
import { CaptionComponent } from '../caption/caption.component';

/** @dynamic */
@Component({
  selector: 'photo-slider-image[sliderImages][currentImageIndex]',
  templateUrl: './slider-image.component.html',
  styleUrls: ['./slider-image.component.scss', '../../image-center-style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderImageComponent implements OnDestroy, OnInit {

  private static GLOBAL_ID = 0;
  private static IMAGES_IN_SLIDER: (SliderImageIndex | null | undefined)[] = new Array(3);

  public currentImage: ImageWithIndex | null | undefined = null;
  public largeImageVisible: boolean = false;
  public captionHeight: string = '0';

  @Input() public caption!: CaptionComponent;
  @Input() private currentImageIndex: number = 0;
  @ViewChild('imageCenter') private imageCenter!: ElementRef<HTMLDivElement>;
  private readonly id: number;
  private captionSubscription!: Subscription;

  constructor(
    private store: LightboxStore,
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.id = SliderImageComponent.GLOBAL_ID;
    SliderImageComponent.GLOBAL_ID += 1;
  }

  @Input()
  private set sliderImages(value: (ImageWithIndex | null)[]) {
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

  public ngOnInit(): void {
    this.captionSubscription = this.caption.captionHeight$.subscribe(h => {
      this.captionHeight = h;
      // Prevent expressionhaschangedafteritwaschecked error
      this.cd.detectChanges();
    });
  }

  public ngOnDestroy(): void {
    SliderImageComponent.GLOBAL_ID -= 1;
    this.captionSubscription.unsubscribe();
  }

  /**
   * Get the index of the image
   */
  public getImageIndex(): number {
    let returnIndex = 0;

    if (this.currentImage) {
      returnIndex = ((this.currentImage.index - (this.currentImageIndex % 3) + 1) % 3);
    }

    return returnIndex;
  }

  /**
   * Close the slider if you click on the black area
   */
  public close(event: MouseEvent): void {
    if (event.target === event.currentTarget || event.target === this.imageCenter.nativeElement) {
      this.store.animateTo('close');
    }
  }

  /**
   * Calculate the stretch config for the images
   */
  public getStretchConfig(): { width: string; height: string } {
    const image = this.currentImage as ResponsiveSliderImageIndex;

    if (image.width === undefined || image.height === undefined) return {height: 'auto', width: 'auto'};

    const window = this.document.defaultView;
    if (!window) return {height: 'auto', width: '100%'};

    const height = image.height / window.innerHeight;
    const width = image.width / window.innerWidth;

    if (height < width) return {height: 'auto', width: '100%'};
    return {height: '100%', width: 'auto'};
  }

  /**
   * Calculate the scrollbar-width and the icon width
   */
  public getRight(): string {
    const window = this.document.defaultView;
    let scrollbarWidth = 0;
    if (window) scrollbarWidth = window.innerWidth - this.document.body.clientWidth;
    if (isNaN(scrollbarWidth)) scrollbarWidth = 0;
    return `calc(5vw + 32px + ${scrollbarWidth}px)`;
  }

}
