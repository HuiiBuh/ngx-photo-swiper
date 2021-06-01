import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SliderModel } from '../../models/gallery';
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
    private ngZone: NgZone
  ) {
    this.route.queryParams.subscribe(params => {
      this.loadSliderStateFromURL(params);
      if (this.firstPageLoad) {
        this.store.onChanges<SliderModel>('slider').subscribe(slider => this.handleSliderURL(slider));
        this.firstPageLoad = false;
      }
    });
  }

  /**
   * Ether save the slider state in the url or remove the slider state from the url if the slider is not active
   */
  private async handleSliderURL(slider: SliderModel): Promise<void> {
    if (slider.active) {
      await this.saveSliderStateToURL(slider);
    } else {
      await this.removeSliderStateFromURL();
    }
  }

  /**
   * Save the parameters which allow the restoration of the slider in the url
   */
  private async saveSliderStateToURL(slider: SliderModel): Promise<void> {
    await this.ngZone.run(() =>
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          imageIndex: String(slider.imageIndex),
          gridID: String(slider.lightboxID),
        },
        queryParamsHandling: 'merge',
        skipLocationChange: false,
      }));
  }

  /**
   * Remove the slider parameters from the url
   */
  private async removeSliderStateFromURL(): Promise<void> {
    const params = {...this.route.snapshot.queryParams};
    delete params.gridID;
    delete params.imageIndex;

    await this.ngZone.run(() =>
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: params,
        skipLocationChange: false,
      }));
  }

  /**
   * @param params URL parameters as json object
   */
  private loadSliderStateFromURL(params: Params): void {
    const gridID = params.gridID;
    const imageIndex = params.imageIndex;

    // @ts-ignore
    if (imageIndex !== undefined && gridID !== undefined && !isNaN(imageIndex)) {
      this.store.updateSlider({imageIndex: parseInt(imageIndex, 0), lightboxID: gridID, active: true});
    } else {
      this.store.closeSlider();
    }
  }
}
