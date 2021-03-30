import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { LightboxStore } from '../../store/lightbox.store';

@Directive({
  selector: '[photoSlider][imageIndex][lightboxID]',
})
export class SliderDirective implements OnInit, OnDestroy {

  @Input() public imageIndex: number | undefined;
  @Input() public lightboxID: string | undefined;
  private clickSubscription: (() => void) | undefined;
  private enterSubscription: (() => void) | undefined;
  private imageElement: HTMLImageElement | undefined | null;

  constructor(
    private element: ElementRef<HTMLElement>,
    private store: LightboxStore,
    private renderer2: Renderer2,
  ) {
  }

  public ngOnInit(): void {
    if (this.imageIndex === undefined || !this.lightboxID) {
      throw new Error('You have to pass the lightboxID, and the imageIndex to the photoSlider' +
        ' directive');
    }

    this.imageElement = this.element.nativeElement as HTMLImageElement;
    if (this.imageElement.tagName.toLowerCase() !== 'img') {
      this.imageElement = this.imageElement.querySelector('img');
      if (!this.imageElement) {
        throw new Error('No image element was found. The photoSlider has to be placed on an image or have an image as a' +
          ' child element');
      }
    }

    this.clickSubscription = this.renderer2.listen(this.element.nativeElement, 'click', this.showSlider.bind(this));
    this.enterSubscription = this.renderer2.listen(this.element.nativeElement, 'keypress.enter', this.showSlider.bind(this));
    this.store.addNativeImageElementToSlider(this.lightboxID, this.imageIndex, this.imageElement);
  }

  public ngOnDestroy(): void {
    if (this.clickSubscription) this.clickSubscription();
    if (this.enterSubscription) this.enterSubscription();
  }

  private showSlider(): void {
    console.log(this.imageIndex);
    // tslint:disable-next-line:no-non-null-assertion
    this.store.updateSlider({imageIndex: this.imageIndex!, lightboxID: this.lightboxID!, active: true});
  }
}
