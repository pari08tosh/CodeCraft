import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MainService } from './main.service';
import 'rxjs/add/operator/map';

@Injectable()
export class NewsFeedService {
  token: any;
  serverAddress: String;

  constructor(
    private http: Http,
    private flashMessagesService: FlashMessagesService,
    private mainService: MainService,
  ) {
    this.serverAddress = this.mainService.getServerAddress();
   }

   addFeed(newFeed) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     this.token = localStorage.getItem('id_token');
     headers.append('Authorization', this.token);
     return this.http.post('http://' + this.serverAddress + '/newsFeeds/addFeed', newFeed, {headers: headers})
       .map(res => res.json());
   }

   deleteFeed(feed) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     this.token = localStorage.getItem('id_token');
     headers.append('Authorization', this.token);
     return this.http.post('http://' + this.serverAddress + '/newsFeeds/deleteFeed', feed, {headers: headers})
       .map(res => res.json());
   }




   getAllFeed() {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     this.token = localStorage.getItem('id_token');
     headers.append('Authorization', this.token);
     return this.http.get('http://' + this.serverAddress + '/newsFeeds/getAllFeed', {headers: headers})
       .map(res => res.json());
   }

   handleError(error: any) {
     this.flashMessagesService.show(error.statusText || "Server Error. Contact admin if error persists", { cssClass: 'alert-danger', timeout: 2500 });
   }




}
