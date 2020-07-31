import {IImage} from '../../../projects/ngx-lightbox/src/lib/interfacecs/ngx-lightbox.interfaces';

export const testData: IImage[] = [
  {
    caption: 'Test caption',
    description: 'Test description',
    width: getRandomSize(),
    height: getRandomSize(),
    imageSRC: 'https://www.w3schools.com/w3css/img_lights.jpg',
  }, {
    caption: 'Test caption',
    description: 'Test description',
    width: getRandomSize(),
    height: getRandomSize(),
    imageSRC: 'https://www.w3schools.com/w3css/img_lights.jpg',
  }, {
    caption: 'Test caption',
    description: 'Test description',
    width: getRandomSize(),
    height: getRandomSize(),
    imageSRC: 'https://www.w3schools.com/w3css/img_lights.jpg',
  }, {
    caption: 'Test caption',
    description: 'Test description',
    width: getRandomSize(),
    height: getRandomSize(),
    imageSRC: 'https://www.w3schools.com/w3css/img_lights.jpg',
  }, {
    caption: 'Test caption',
    description: 'Test description',
    width: getRandomSize(),
    height: getRandomSize(),
    imageSRC: 'https://www.w3schools.com/w3css/img_lights.jpg',
  }, {
    caption: 'Test caption',
    description: 'Test description',
    width: getRandomSize(),
    height: getRandomSize(),
    imageSRC: 'https://www.w3schools.com/w3css/img_lights.jpg',
  },
];


function getRandomSize(): number {
  return Math.round(Math.random() * (600 - 200) + 200);
}
