import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SliderImage } from '../../models/gallery';
import { NgxLightboxService } from '../../ngx-lightbox.service';
import { LightboxStore } from '../../store/lightbox.store';

@Component({
  selector: 'photo-square-gallery[lightboxID]',
  templateUrl: './square-gallery.component.html',
  styleUrls: ['./square-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SquareGalleryComponent implements OnInit {

  @Input() public lightboxID!: string;
  public imageList!: Observable<SliderImage[]>;
  public sliderActive!: Observable<boolean>;

  constructor(private ngxLightboxService: NgxLightboxService, private store: LightboxStore) {
  }

  public ngOnInit(): void {
    this.imageList = this.store.onChanges<SliderImage[]>('gallery', this.lightboxID);
    this.sliderActive = this.store.onChanges<boolean>('slider', 'active');
  }

  public loadSlider(imageIndex: number): void {
    this.ngxLightboxService.loadIndexInSlider(imageIndex, this.lightboxID);
  }
}
