import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {IImage, Slider} from '../../ngx-lightbox.interfaces';
import {NgxLightboxService} from '../../ngx-lightbox.service';
import {LightboxStore} from '../../store/lightbox.store';

@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit, OnDestroy {


  constructor(private lightboxService: NgxLightboxService, private store: LightboxStore) {
  }

  private storeChangeSubscription!: Subscription;
  private gallerySubscription: Subscription | undefined;

  public imageList: IImage[] = [];
  public sliderState!: Slider;

  public ngOnInit(): void {
    this.storeChangeSubscription = this.store.onChanges<Slider>('slider')
      .subscribe(value => {
        this.sliderState = value;
        if (value.active) {
          this.subscribeToNewGallery();
        }
      });
  }

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


  hideSlider(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.lightboxService.removeSlider();
    }
  }

  @HostListener('window:keyup', ['$event.key'])
  bindEscape(key: string): void {
    if (key === 'Escape') {
      this.lightboxService.removeSlider();
    }
  }

}
