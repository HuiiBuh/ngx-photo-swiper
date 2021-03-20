import { Component, Input, TemplateRef } from '@angular/core';
import { SliderImage, SliderImageSmall } from '../../models/gallery';
import { ControlsComponent } from '../../slider/components/controls/controls.component';
import { LightboxStore } from '../../store/lightbox.store';

@Component({
  selector: 'ngx-lightbox[lightboxID][imageList]',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss'],
})
export class LightboxComponent {

  @Input() public controls: TemplateRef<ControlsComponent> | null = null;
  @Input() public lightboxID!: string;
  @Input() public galleryType: 'flex' | 'square' | 'own' = 'own';

  constructor(private store: LightboxStore) {
  }

  private _imageList: (SliderImage | SliderImageSmall)[] | undefined;

  @Input()
  public set imageList(value: (SliderImage | SliderImageSmall)[]) {
    this.store.addGallery({[this.lightboxID]: value});
    this._imageList = value;
  }
}
