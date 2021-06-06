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
        this.store.getSlider$().subscribe(slider => this.handleSliderURL(slider));
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

    const params = this.route.snapshot.queryParams;

    let replace = false;

    // Don't save every image change in the history
    if ('lightboxId' in params && params.lightboxId === slider.lightboxID) replace = true;

    await this.ngZone.run(() =>
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          imageIndex: String(slider.imageIndex),
          lightboxId: String(slider.lightboxID),
        },
        queryParamsHandling: 'merge',
        skipLocationChange: false,
        replaceUrl: replace
      }));
  }

  /**
   * Remove the slider parameters from the url
   */
  private async removeSliderStateFromURL(): Promise<void> {
    const params = {...this.route.snapshot.queryParams};
    delete params.lightboxId;
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
    const lightboxId = params.lightboxId;
    const imageIndex = params.imageIndex;

    const image = this.store.getCurrentImage();

    // @ts-ignore
    if (imageIndex !== undefined && lightboxId !== undefined && !isNaN(imageIndex)) {
      // Current image is already loaded
      if (image && image.index === parseInt(imageIndex, 0)) return;
      this.store.openSlider({imageIndex: parseInt(imageIndex, 0), lightboxID: lightboxId});
      this.store.animateTo('open');
    } else {
      // Dont try to animate to closed if the lightbox is already closed
      if (!image) return;
      this.store.animateTo('close');
    }
  }
}
