import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { IImage } from '../../models/gallery';
import { NgxLightboxService } from '../../ngx-lightbox.service';
import { LightboxStore } from '../../store/lightbox.store';

@Directive({
  selector: '[photoSlider]',
})
export class PhotoSliderDirective implements OnInit, OnDestroy {

  @Input() public image: IImage | undefined;
  @Input() public lightboxID: string | undefined;
  private clickSubscription: (() => void) | undefined;
  private imageIndex: number | undefined;

  constructor(
    private element: ElementRef<HTMLElement>,
    private store: LightboxStore,
    private renderer2: Renderer2,
    private ngxLightboxService: NgxLightboxService,
  ) {
  }

  public ngOnInit(): void {
    if (!this.image || !this.lightboxID) throw new Error('You have to pass the lightboxID, and the image to the photoSlider directive');
    this.imageIndex = this.store.addImageToGallery(this.image, this.lightboxID);
    this.clickSubscription = this.renderer2.listen(this.element.nativeElement, 'click', this.showSlider.bind(this));
  }

  public ngOnDestroy(): void {
    if (this.clickSubscription) this.clickSubscription();
  }

  private showSlider(): void {
    // tslint:disable-next-line:no-non-null-assertion
    this.ngxLightboxService.loadIndexInSlider(this.imageIndex!, this.lightboxID!);
  }
}
