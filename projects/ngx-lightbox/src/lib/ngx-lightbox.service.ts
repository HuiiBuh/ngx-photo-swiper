import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LightboxState} from './lightbox.state';
import {IImage} from './ngx-lightbox.interfaces';

@Injectable({
  providedIn: 'root'
})
export class NgxLightboxService {

  constructor(private router: Router, private route: ActivatedRoute, private store: LightboxState) {
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
    const imageIndex = this.route.snapshot.paramMap.get('imageNumber');
    const gridID = this.route.snapshot.paramMap.get('gridID');

    if (imageIndex && gridID) {
      this.store.updateSlider({imageIndex, gridID, active: true});
    }
  }
}
