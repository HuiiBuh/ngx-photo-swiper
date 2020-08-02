import {Component, Input, OnInit} from '@angular/core';
import {IImage} from '../../ngx-lightbox.interfaces';
import {NgxLightboxService} from '../../ngx-lightbox.service';
import {LightboxStore} from '../../store/lightbox.store';

@Component({
  selector: 'lib-gallery-component[imageList][lightboxID]',
  templateUrl: 'ngx-gallery.component.html',
  styleUrls: ['ngx-gallery.component.scss'],
})
export class NgxGalleryComponent implements OnInit {

  constructor(private ngxLightboxService: NgxLightboxService, private store: LightboxStore) {
  }

  @Input() imageList!: IImage[];
  @Input() lightboxID!: string;

  ngOnInit(): void {
    this.store.addGallery({[this.lightboxID]: this.imageList});
    this.store.onChanges<IImage[]>('gallery', this.lightboxID).subscribe(value => this.imageList = value);
  }

  public loadSlider(imageIndex: number, image: IImage): void {
    this.ngxLightboxService.loadImageInSlider(imageIndex, image, this.lightboxID);
  }
}
