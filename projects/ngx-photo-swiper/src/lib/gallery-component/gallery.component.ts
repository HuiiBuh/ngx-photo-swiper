import { Component, Input, TemplateRef } from '@angular/core';
import { IImage } from '../models/gallery';
import { ControlsComponent } from '../slider/components/controls/controls.component';
import { LightboxStore } from '../store/lightbox.store';

@Component({
  selector: 'photo-gallery[lightboxID][imageList]',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {

  @Input() public controls: TemplateRef<ControlsComponent> | null = null;
  @Input() public lightboxID!: string;
  @Input() public galleryType: 'flex' | 'square' | 'own' = 'flex';

  constructor(private store: LightboxStore) {
  }

  public _imageList: IImage[] | undefined;

  @Input()
  public set imageList(value: IImage[]) {
    this.store.addGallery({[this.lightboxID]: value});
    this._imageList = value;
  }

}
