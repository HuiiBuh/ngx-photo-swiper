import {Component, OnDestroy, OnInit} from '@angular/core';
import {Slider} from '../../ngx-lightbox.interfaces';
import {LightboxStore} from '../../store/lightbox.store';

@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit, OnDestroy {

  constructor(private store: LightboxStore) {
    this.store.onChanges<Slider>('slider')
      .subscribe(value => {
        this.sliderState = value;
      });
  }

  public sliderState!: Slider;

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

}
