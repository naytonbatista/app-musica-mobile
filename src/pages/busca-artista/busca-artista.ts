import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppHttpService } from '../../app/app-http.service'

@IonicPage()
@Component({
  selector: 'page-busca-artista',
  templateUrl: 'busca-artista.html',
})
export class BuscaArtistaPage {

  

  items = [{ nome: 'Anitta', img: 'https://s2.vagalume.com/anitta/images/anitta.jpg' },
  { nome: 'Claudia Leitte', img: 'https://s2.vagalume.com/claudia-leitte/images/claudia-leitte.jpg' }];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private service: AppHttpService) {
  }

  search(e: any) {
    
    this.service.vagalumeSearch('art', e.target.value).then(res => {

      if (res.length <= 0) {
        return;
      }

      this.items = [];

      this.items = res.response.docs.map(x => {

        const imageName = x.url.split('/')[1];

        return { nome: x.band, img: `https://s2.vagalume.com/${imageName}/images/${imageName}.jpg` };

      });


    });
  }

}
