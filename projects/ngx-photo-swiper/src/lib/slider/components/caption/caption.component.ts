import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ImageWithIndex, SliderImageIndex } from '../../../models/gallery';
import { LightboxStore } from '../../../store/lightbox.store';

// @dynamic
@Component({
  selector: 'photo-caption[sliderImages][currentImageIndex]',
  templateUrl: './caption.component.html',
  styleUrls: ['./caption.component.scss', '../../image-center-style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptionComponent implements OnDestroy, AfterViewInit {

  private static GLOBAL_ID = 0;
  private static IMAGES_IN_SLIDER: (SliderImageIndex | null | undefined)[] = new Array(3);

  public currentImage: ImageWithIndex | null | undefined = null;
  public captionHeight$ = new Subject<string>();

  private readonly id: number;
  @ViewChild('caption') private caption: ElementRef | undefined;
  @ViewChild('smallCaption') private smallCaption: ElementRef | undefined;
  @ViewChild('captionContainer') private captionContainer: ElementRef | undefined;
  @Input() private currentImageIndex: number = 0;

  constructor(
    private store: LightboxStore,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.id = CaptionComponent.GLOBAL_ID;
    CaptionComponent.GLOBAL_ID += 1;
  }

  @Input()
  private set sliderImages(value: (ImageWithIndex | null)[]) {
    let image = value.find(i => i?.index === this.currentImage?.index);
    if (!image && !this.currentImage) {
      image = value[this.id];
    } else if (!image) {
      const indexList = CaptionComponent.IMAGES_IN_SLIDER.map(i => i?.index);
      image = value.filter(i => !indexList.includes(i?.index))[0];
    }

    CaptionComponent.IMAGES_IN_SLIDER[this.id] = image;
    this.currentImage = image;
    this.updateCaptionText();
  }

  public ngAfterViewInit(): void {
    this.updateCaptionText();
  }

  public ngOnDestroy(): void {
    CaptionComponent.GLOBAL_ID -= 1;
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

  private updateCaptionText(): void {
    if (!this.currentImage) return;

    if (this.caption && this.currentImage.caption) {
      this.caption.nativeElement.innerText = this.currentImage.caption;
    }

    if (this.smallCaption && this.currentImage.smallCaption) {
      this.renderer.setStyle(this.smallCaption.nativeElement, 'display', 'block');
      this.smallCaption.nativeElement.innerText = this.currentImage.smallCaption;
    } else {
      this.smallCaption && this.renderer.setStyle(this.smallCaption.nativeElement, 'display', 'none');
    }

    // Give the elements time to "find" their height
    setTimeout(() => {
      if (this.captionContainer) {
        console.log(`calc(${this.captionContainer.nativeElement.clientHeight}px + .5rem + 1rem)`);
        this.captionHeight$.next(`calc(${this.captionContainer.nativeElement.clientHeight}px + .5rem + 1rem)`);
      }
    });

  }
}
