import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MainService } from './main.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class NotificationService {
  serverAddress: String;
  token: any;

  constructor(
    private http: Http,
    private flashMessagesService: FlashMessagesService,
    private mainService: MainService,
  ) {
    this.serverAddress = this.mainService.getServerAddress();
  }

  getUnreadNotifications(userData) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/notifications/getUnreadNotifications', userData, {headers: headers})
      .map(res => res.json());
  }

  markAsRead(data) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/notifications/markAsRead', data, {headers: headers})
      .map(res => res.json());
  }

  handleError(error: any) {
    this.flashMessagesService.show(error.statusText || "Server Error. Contact admin if error persists", { cssClass: 'alert-danger', timeout: 2500 });
  }

}
