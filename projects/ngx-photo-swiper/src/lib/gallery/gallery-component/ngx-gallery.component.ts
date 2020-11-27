import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { IImage } from '../../models/gallery';
import { NgxLightboxService } from '../../ngx-lightbox.service';
import { ControlsComponent } from '../../slider/controls/controls.component';
import { LightboxStore } from '../../store/lightbox.store';

@Component({
  selector: 'lib-gallery-component[imageList][lightboxID]',
  templateUrl: 'ngx-gallery.component.html',
  styleUrls: ['ngx-gallery.component.scss'],
})
export class NgxGalleryComponent implements OnInit {

  @Input()
  controls: TemplateRef<ControlsComponent> | null = null;
  @Input() imageList!: IImage[];
  @Input() lightboxID!: string;
  public sliderActive!: boolean;

  constructor(private ngxLightboxService: NgxLightboxService, private store: LightboxStore) {
  }

  ngOnInit(): void {
    this.store.addGallery({[this.lightboxID]: this.imageList});
    this.store.onChanges<IImage[]>('gallery', this.lightboxID).subscribe(value => this.imageList = value);
    this.store.onChanges<boolean>('slider', 'active').subscribe(value => this.sliderActive = value);
  }

  public loadSlider(imageIndex: number, image: IImage): void {
    this.ngxLightboxService.loadImageInSlider(imageIndex, image, this.lightboxID);
  }
}
