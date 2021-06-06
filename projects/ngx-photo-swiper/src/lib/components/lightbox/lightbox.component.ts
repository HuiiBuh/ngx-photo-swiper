import { ChangeDetectionStrategy, Component, Input, Output, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponsiveSliderImage, SliderImage } from '../../models/gallery';
import { ControlsComponent } from '../../slider/components/controls/controls.component';
import { UrlHandlerService } from '../../slider/services/url-handler.service';
import { LightboxStore } from '../../store/lightbox.store';

@Component({
  selector: 'photo-lightbox[lightboxID][imageList]',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightboxComponent {

  @Input() public lightboxID!: string;
  @Input() public controls: TemplateRef<ControlsComponent> | null = null;
  @Input() public galleryType: 'flex' | 'square' | 'own' = 'own';

  @Output() public openLightbox: Observable<null>;
  @Output() public closeLightbox: Observable<null>;
  @Output() public next: Observable<null>;
  @Output() public previous: Observable<null>;

  constructor(
    private store: LightboxStore,
    private _: UrlHandlerService,
  ) {
    this.openLightbox = this.store.getOnOpen$();
    this.closeLightbox = this.store.getOnClose$();
    this.next = this.store.getOnNext$();
    this.previous = this.store.getOnPrevious$();
  }

  @Input()
  public set infiniteSwipe(value: boolean) {
    this.store.editOrAddGallery(this.lightboxID, {infiniteSwipe: value});
  }

  @Input()
  public set imageList(value: (SliderImage | ResponsiveSliderImage)[]) {
    this.store.editOrAddGallery(this.lightboxID, {images: value});
  }

}
