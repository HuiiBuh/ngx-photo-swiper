import {Location} from '@angular/common';
import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IImage} from './ngx-lightbox.interfaces';
import {LightboxStore} from './store/lightbox.store';

@Injectable({
  providedIn: 'root'
})
export class NgxLightboxService {

  constructor(private router: Router, private route: ActivatedRoute, private store: LightboxStore, private location: Location) {
    this.loadImageFromURL();
  }

  public loadImageInSlider(imageIndex: number, image: IImage, gridID: string): void {
    this.saveSliderStateToURL(imageIndex, gridID);
    this.store.updateSlider({imageIndex, gridID, active: true});
  }

  private saveSliderStateToURL(imageIndex: number, gridID: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        gridID: String(gridID),
        imageIndex: String(imageIndex)
      },
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
  }

  private loadImageFromURL(): void {
    const params: URLSearchParams = new URLSearchParams(this.location.path());

    const gridID = params.get('gridID');
    const imageIndex = params.get('imageIndex');


    // @ts-ignore
    if (imageIndex && !isNaN(imageIndex) && gridID) {
      this.store.updateSlider({imageIndex: parseInt(imageIndex, 0), gridID, active: true});
    }
  }
}
