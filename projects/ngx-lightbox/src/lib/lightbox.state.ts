import {Injectable} from '@angular/core';
import {Store} from 'rxjs-observable-store';
import {GalleryState, Slider, TGallery} from './ngx-lightbox.interfaces';


@Injectable()
export class LightboxState extends Store<GalleryState> {
  constructor() {
    super(new GalleryState());
  }

  addGallery(gallery: TGallery): void {
    this.setState({
      slider: this.state.slider,
      gallery: {
        ...this.state.gallery,
        ...gallery
      }
    });
  }

  updateSlider(slider: Slider): void {
    this.setState({
        ...this.state,
        slider
      }
    );
  }
}
