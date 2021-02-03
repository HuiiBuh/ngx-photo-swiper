import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { IImage } from '../../models/gallery';
import { NgxLightboxService } from '../../ngx-lightbox.service';
import { ControlsComponent } from '../../slider/components/controls/controls.component';
import { LightboxStore } from '../../store/lightbox.store';

@Component({
  selector: 'photo-gallery-component[imageList][lightboxID]',
  templateUrl: 'gallery.component.html',
  styleUrls: ['gallery.component.scss'],
})
export class GalleryComponent implements OnInit {

  @Input() public controls: TemplateRef<ControlsComponent> | null = null;
  @Input() public imageList!: IImage[];
  @Input() public lightboxID!: string;
  public sliderActive!: boolean;

  constructor(private ngxLightboxService: NgxLightboxService, private store: LightboxStore) {
  }

  public ngOnInit(): void {
    this.store.addGallery({[this.lightboxID]: this.imageList});
    this.store.onChanges<IImage[]>('gallery', this.lightboxID).subscribe(value => this.imageList = value);
    this.store.onChanges<boolean>('slider', 'active').subscribe(value => this.sliderActive = value);
  }

  public loadSlider(imageIndex: number): void {
    this.ngxLightboxService.loadIndexInSlider(imageIndex, this.lightboxID);
  }
}
