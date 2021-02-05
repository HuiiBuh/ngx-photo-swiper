/*
 * Public API Surface of ngx-photo-swiper
 */

// Flex Gallery
export { FlexGalleryModule } from './lib/galleries/flex-gallery/flex-gallery.module';
export { FlexGalleryComponent } from './lib/galleries/flex-gallery/flex-gallery/flex-gallery.component';

// Slider
export { SliderModule } from './lib/slider/slider.module';
export { ControlsComponent } from './lib/slider/components/controls/controls.component';
export { SliderDirective } from './lib/slider/directives/slider.directive';

// Models
export * from './lib/models/gallery';
export * from './lib/models/slider';
export * from './lib/models/touchmove';
