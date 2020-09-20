import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {IImage} from '../../ngx-lightbox.interfaces';
import {NgxLightboxService} from '../../ngx-lightbox.service';
import {ControlsComponent} from '../../slider/controls/controls.component';
import {LightboxStore} from '../../store/lightbox.store';

@Component({
  selector: 'lib-gallery-component[imageList][lightboxID]',
  templateUrl: 'ngx-gallery.component.html',
})
export class NgxGalleryComponent implements OnInit {

  @Input()
  controls: TemplateRef<ControlsComponent> | null = null;

  constructor(private ngxLightboxService: NgxLightboxService, private store: LightboxStore) {
  }

  @Input() imageList!: IImage[];
  @Input() lightboxID!: string;

  public sliderActive!: boolean;

  ngOnInit(): void {
    this.store.addGallery({[this.lightboxID]: this.imageList});
    this.store.onChanges<IImage[]>('gallery', this.lightboxID).subscribe(value => this.imageList = value);
    this.store.onChanges<boolean>('slider', 'active').subscribe(value => this.sliderActive = value);
  }

  public loadSlider(imageIndex: number, image: IImage): void {
    this.ngxLightboxService.loadImageInSlider(imageIndex, image, this.lightboxID);
  }
}
