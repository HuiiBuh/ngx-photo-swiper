import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';
import { OwnGalleryComponent } from './own-gallery/own-gallery.component';

const routes: Routes = [
  {path: '', component: GalleryComponent},
  {path: 'own', component: OwnGalleryComponent},
  {path: '*', redirectTo: '/'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
