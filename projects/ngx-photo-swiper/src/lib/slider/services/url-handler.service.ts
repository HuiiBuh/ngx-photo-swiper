import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Slider } from '../../models/gallery';
import { LightboxStore } from '../../store/lightbox.store';

@Injectable({
  providedIn: 'root',
})
export class UrlHandlerService {

  private firstPageLoad = true;

  constructor(
    private store: LightboxStore,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {

    this.loadSliderStateFromURL();
    this.router.events.subscribe((navigation) => {
      if (navigation instanceof NavigationEnd) {
        this.loadSliderStateFromURL();

        if (this.firstPageLoad) {
          this.store.onChanges<Slider>('slider').subscribe(value => this.handleSliderURL(value));
          this.firstPageLoad = false;
        }
      }
    });
  }

  private handleSliderURL(slider: Slider): void {
    if (slider.active) {
      this.saveSliderStateToURL(slider);
    } else {
      this.removeSliderStateFromURL();
    }
  }

  private saveSliderStateToURL(slider: Slider): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        gridID: String(slider.lightboxID),
        imageIndex: String(slider.imageIndex),
      },
      queryParamsHandling: 'merge',
      skipLocationChange: false,
    });
  }

  private removeSliderStateFromURL(): void {
    const params = {...this.route.snapshot.queryParams};
    delete params.gridID;
    delete params.imageIndex;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      skipLocationChange: false,
    });
  }

  private loadSliderStateFromURL(): void {
    const params: URLSearchParams = new URLSearchParams(this.location.path());

    const gridID = params.get('gridID');
    const imageIndex = params.get('imageIndex');

    // @ts-ignore
    if (imageIndex && !isNaN(imageIndex) && gridID) {
      this.store.updateSlider({imageIndex: parseInt(imageIndex, 0), lightboxID: gridID, active: true});
    } else {
      this.store.closeSlider();
    }
  }
}
