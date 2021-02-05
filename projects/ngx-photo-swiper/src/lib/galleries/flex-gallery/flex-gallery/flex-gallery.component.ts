import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IImage } from '../../../models/gallery';
import { NgxLightboxService } from '../../../ngx-lightbox.service';
import { LightboxStore } from '../../../store/lightbox.store';

@Component({
  selector: 'photo-flex-gallery[lightboxID]',
  templateUrl: 'flex-gallery.component.html',
  styleUrls: ['flex-gallery.component.scss'],
})
export class FlexGalleryComponent implements OnInit {

  @Input() public lightboxID!: string;
  public imageList!: Observable<IImage[]>;
  public sliderActive!: Observable<boolean>;

  constructor(private ngxLightboxService: NgxLightboxService, private store: LightboxStore) {
  }

  public ngOnInit(): void {
    this.imageList = this.store.onChanges<IImage[]>('gallery', this.lightboxID);
    this.sliderActive = this.store.onChanges<boolean>('slider', 'active');
  }

  public loadSlider(imageIndex: number): void {
    this.ngxLightboxService.loadIndexInSlider(imageIndex, this.lightboxID);
  }
}
