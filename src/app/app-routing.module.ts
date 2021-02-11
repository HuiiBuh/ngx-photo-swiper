import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlexGalleryComponent } from './flex-gallery/flex-gallery.component';
import { OwnGalleryComponent } from './own-gallery/own-gallery.component';
import { SquareGalleryComponent } from './sqare-gallery/square-gallery.component';

const routes: Routes = [
  {path: 'flex', component: FlexGalleryComponent},
  {path: 'square', component: SquareGalleryComponent},
  {path: 'own', component: OwnGalleryComponent},
  {path: '**', redirectTo: '/flex'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
