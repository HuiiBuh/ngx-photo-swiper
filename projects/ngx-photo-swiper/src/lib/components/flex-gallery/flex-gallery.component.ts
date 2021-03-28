import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GalleryModel, SliderImage } from '../../models/gallery';
import { NgxLightboxService } from '../../ngx-lightbox.service';
import { LightboxStore } from '../../store/lightbox.store';

@Component({
  selector: 'photo-flex-gallery[lightboxID]',
  templateUrl: 'flex-gallery.component.html',
  styleUrls: ['flex-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlexGalleryComponent implements OnInit {

  @Input() public lightboxID!: string;
  public imageList!: Observable<SliderImage[]>;
  public sliderActive!: Observable<boolean>;

  constructor(private ngxLightboxService: NgxLightboxService, private store: LightboxStore) {
  }

  public ngOnInit(): void {
    this.imageList = this.store.onChanges<GalleryModel>('gallery', this.lightboxID).pipe(map(gallery => gallery.images));
    this.sliderActive = this.store.onChanges<boolean>('slider', 'active');
  }
}
