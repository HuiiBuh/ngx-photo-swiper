import {Location} from '@angular/common';
import {Injectable} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Slider} from '../ngx-lightbox.interfaces';
import {LightboxStore} from '../store/lightbox.store';

@Injectable({
  providedIn: 'root'
})
export class UrlSliderHandlerService {

  constructor(
    private store: LightboxStore,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) {

    this.loadSliderStateFromURL();
    this.store.onChanges<Slider>('slider').subscribe(value => this.handleSliderURL(value));
    this.router.events.subscribe((value) => {
      if (value instanceof NavigationEnd) {
        this.loadSliderStateFromURL();
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
        gridID: String(slider.gridID),
        imageIndex: String(slider.imageIndex)
      },
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
  }

  private removeSliderStateFromURL(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      skipLocationChange: false
    });
  }


  private loadSliderStateFromURL(): void {
    const params: URLSearchParams = new URLSearchParams(this.location.path());

    const gridID = params.get('gridID');
    const imageIndex = params.get('imageIndex');

    // @ts-ignore
    if (imageIndex && !isNaN(imageIndex) && gridID) {
      this.store.updateSlider({imageIndex: parseInt(imageIndex, 0), gridID, active: true});
    } else {
      this.store.closeSlider();
    }
  }
}
