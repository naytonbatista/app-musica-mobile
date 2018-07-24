import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuscaArtistaPage } from './busca-artista';

@NgModule({
  declarations: [
    BuscaArtistaPage,
  ],
  imports: [
    IonicPageModule.forChild(BuscaArtistaPage),
  ],
})
export class BuscaArtistaPageModule {}
