import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import 'rxjs/add/operator/toPromise';

@Injectable()

export class AppHttpService {

    protected url: string;
    protected header: Headers;

    constructor(protected http: Http, private alertControl: AlertController, public eventEmitter: Events) {
        this.setAccessToken();
    }

    request() {
        return this.http;
    }

    setAccessToken() {
        let token = this.getCookie('token');
        this.header = new Headers({ 'Authorization': 'Bearer ' + token, 'Accept': 'application/json' });
    }

    public getCookie(name: string) {
        let cookies = document.cookie;
        if (!cookies) {
            return null;
        }

        let cookiesCollection: string[] = cookies.split(';');
        for (let i = 0; i < cookiesCollection.length; i++) {
            let cookieCurrent = cookiesCollection[i].split('=');

            if (cookieCurrent[0].trim() === name) {
                return cookieCurrent[1] || null;
            }
        }

        return null;
    }

    builder(resource: string) {
        this.url = 'http://localhost:8080/api/' + resource;
        return this;
    }
    
    vagalumeSearch(resource: string, query: string) {

        const  url = 'https://api.vagalume.com.br/search.' + resource + '?q=' + query;

        const observable = this.http.get(url);
        return this.toPromise(observable);

    }

    list(options: any = {}) {
        let url = this.url;

        if (options.filters !== undefined) {
            let filters = options.filters;
            filters.forEach((item, index) => {
                let field = Object.keys(item)[0];
                let value = item[field];
                url = url + '?where[' + field + ']=' + value;
            });
        }

        let observable = this.http.get(url);
        return this.toPromise(observable);
    }

    protected toPromise(request) {
        return request.toPromise()
            .then((res) => {
                return res.json() || {}
            })
            .catch((err) => {
                let message = 'Algo deu errado no servidor, informe o erro ' + err.status + ' ao administrador';
                if (err.status === 401) {
                    message = 'Você não tem permissão para ver isso, informe um usuário e senha válidos';
                    this.eventEmitter.publish('user');
                }

                if (err.status === 422) {
                    message = 'Falha de validação, verifique os campos';
                }

                if (err.status === 404) {
                    message = 'Impossível se conectar ao servidor, verifique sua conexão ou tente novamente em alguns minutos';
                }

                this.showAlert(message);

                return err;
            });
    }

    public showAlert(message) {
        let prompt = this.alertControl.create({
            title: 'Algo deu errado',
            message: message,
            buttons: [
                {
                    text: 'Ok',
                    handler: data => {
                        console.log('Btn "ok" in Alert control clicked')
                    }
                }
            ]
        });
        prompt.present();
    }
}
