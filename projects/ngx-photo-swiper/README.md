# Photo Swiper for Angular

![Build and Publish](https://github.com/HuiiBuh/ngx-photo-swiper/workflows/Build%20and%20Publish/badge.svg)
![Deploy](https://github.com/HuiiBuh/ngx-photo-swiper/workflows/Deploy/badge.svg)
![NPM package](https://img.shields.io/npm/v/ngx-photo-swiper.svg?logo=npm&logoColor=fff&label=NPM+package&color=rgb(48,%20197,%2083))

A zero dependency (except Angular + Router obviously) touch and mobile friendly lightbox which supports server side
rendering out of the box.

## Install

Take a look at the [demo](https://huiibuh.github.io/ngx-photo-swiper) to take a look at the result.  
Install the [NPM package](https://www.npmjs.com/package/ngx-photo-swiper) with `npm install --save ngx-photo-swiper`.

## Basic usage

```typescript
// Import the Lightbox Module and include it in your module imports
import { LightboxModule } from "ngx-photo-swiper";
```

Create a list of `IImage` objets which should be displayed in the lightbox and pass them to the template.

```typescript
import { IImage } from 'ngx-photo-swiper';

class AppComponent {
  public imageList: IImage[] = [
    {
      caption: "Test caption 1",
      imageSRC: "image_url.com",
    },
    {
      caption: "Test caption 2",
      imageSRC: "image_url.com",
    },
  ];
}
```

The following code is in one of you HTML templates. The lightbox needs two parameters to work:

+ the `imageList` parameter which provides your images
+ the `lightboxID` parameter which assigns ever lightbox on the page a __unique__ ID which gets used in the URL
+ If you don't pass a reference to the `controls` no controls will appear and basically nothing in the slider works.
+ If you want some sharing options you have to pass a template reference to some HTML. I have only tested Anchor
  Elements, so these should be fine.

```html
<!-- Add the gallery component and pass it you images -->
<!-- Every lightbox has to have a id, so the currently open gallery can be saved in the url -->
<!-- The id should be the same each time you reload the page -->
<photo-gallery-component [imageList]="imageList" lightboxID="test" [controls]="controlsComponent"></photo-gallery-component>

If your lightbox should have some controls you have to pass these to the photo-gallery-component
<ng-template #controlsComponent>
  <!-- In addition you can configure the fadeoutTime, and which control should be displayed -->
  <!-- showOnMobile controls whether the controls should be displayed on mobile or not -->
  <!-- To get some custom share options pass these to the photo-controls -->
  <photo-controls 
    [fadeoutTime]="1000" [fullscreen]="true" [close]="true" [arrows]="true" [showOnMobile]="true"
    [shareOptionList]="shareOptions"></photo-controls>
</ng-template>

<!-- If you have Anchor elements in you ng-template the styling will look nice -->
<!-- I will not guarantee the styling for any other element type -->
<ng-template #shareOptions>
  <a href="https://google.com">Google</a>
  <a href="https://google.com">WhatsApp</a>
  <a href="https://google.com">Instagram</a>
</ng-template>
```

If you want to change the style of the lib you can do so by importing the *ngx-photo-swiper/lightbox.scss* file. The
following preferences are possible and have to be configured before you import the *lightbox.scss* file. Make sure you
import the file in your global scss file to make sure the styles get applied correctly.

```scss
// Default margin between the images in the gallery
$image-margin             : .5rem !default;
// Lightbox background color
$backdrop-color           : #000 !default;
// Overlay (Text, controls background) color
$overlay-background-color : rgba(0, 0, 0, 0.3) !default;
// Color of the arrow keys
$arrow-background-color   : rgba(0, 0, 0, 0.3) !default;
// Text color in the slider
$overlay-text-color       : #fff !default;
// Height and width of the arrow click area
$arrow-click-radius       : ("width": 60px, "height": 80px);
// You own icons (really dont recommend chaining this, but if you want to ...)
$icon-svg                 : "";
$icon-png                 : "";

// Import the scss file after your preferences
@import "ngx-photo-swiper/lightbox.scss";

```

## Result

#### The gallery

![Gallery](https://i.imgur.com/iWmJHAR.jpg)

#### The slider with a desktop viewport

![Slider Desktop](https://i.imgur.com/vEN8BL1.jpg)

#### The slider with a mobile viewport (currently transitioning)

![Slider Smartphone](https://i.imgur.com/yZVPREe.jpg)

## Credits

- Inspired by [photoswipe](https://photoswipe.com)
- The Icons are also from [photoswipe](https://photoswipe.com)
- The [observable store](https://github.com/georgebyte/rxjs-observable-store) was copied and modified to get soma
  additional functionality and angular 10 support
