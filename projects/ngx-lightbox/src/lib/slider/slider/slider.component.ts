import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {IImage, Slider} from '../../ngx-lightbox.interfaces';
import {NgxLightboxService} from '../../ngx-lightbox.service';
import {LightboxStore} from '../../store/lightbox.store';
import {SliderService} from '../slider.service';

@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit, OnDestroy {


  public imageList: IImage[] = [];
  public sliderState!: Slider;
  private storeChangeSubscription!: Subscription;
  private gallerySubscription!: Subscription;

  constructor(private lightboxService: NgxLightboxService, private store: LightboxStore, public sliderService: SliderService) {
  }

  public ngOnInit(): void {
    this.storeChangeSubscription = this.store.onChanges<Slider>('slider')
      .subscribe(value => {
        this.sliderState = value;
        if (value.active) {
          this.subscribeToNewGallery();
        }
      });
  }

  /**
   * Unsubscribe to the current library and subscribe to the new one
   */
  subscribeToNewGallery(): void {
    if (this.gallerySubscription) {
      this.gallerySubscription.unsubscribe();
    }

    this.gallerySubscription = this.store.onChanges<IImage[]>('gallery', this.sliderState.gridID)
      .subscribe(value => this.imageList = value);
  }

  public ngOnDestroy(): void {
    this.storeChangeSubscription.unsubscribe();

    if (this.gallerySubscription) {
      this.gallerySubscription.unsubscribe();
    }
  }

}
