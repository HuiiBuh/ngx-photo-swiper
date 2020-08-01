import {Component, Input, OnInit} from '@angular/core';
import {LightboxState} from '../../lightbox.state';
import {IImage} from '../../ngx-lightbox.interfaces';
import {NgxLightboxService} from '../../ngx-lightbox.service';

@Component({
  selector: 'lib-gallery-component[imageList][lightboxID]',
  templateUrl: 'ngx-gallery.component.html',
  styleUrls: ['ngx-gallery.component.scss'],
})
export class NgxGalleryComponent implements OnInit {

  constructor(private ngxLightboxService: NgxLightboxService, private lightboxState: LightboxState) {
    lightboxState.addGallery({[this.lightboxID]: this.imageList});
  }

  @Input() imageList!: IImage[];
  @Input() lightboxID!: string;

  ngOnInit(): void {
    this.lightboxState.onChanges('gallery', this.lightboxID);
  }

  public loadSlider(imageIndex: number, image: IImage): void {
    this.ngxLightboxService.loadImageInSlider(imageIndex, image, this.lightboxID);
  }
}
