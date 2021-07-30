import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomGalleryComponent } from './custom-gallery/custom-gallery.component';
import { FlexGalleryComponent } from './flex-gallery/flex-gallery.component';
import { PlaygroundGalleryComponent } from './playground/playground-gallery.component';
import { SquareGalleryComponent } from './sqare-gallery/square-gallery.component';

const routes: Routes = [
  {path: 'flex', component: FlexGalleryComponent},
  {path: 'square', component: SquareGalleryComponent},
  {path: 'custom', component: CustomGalleryComponent},
  {path: 'few', component: PlaygroundGalleryComponent},
  {path: '**', redirectTo: '/square'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
