import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MainService } from './main.service';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  authToken: any;
  user: any;
  static userRole: String;
  token: any;
  serverAddress: String;

  constructor(
    private http: Http,
    private flashMessagesService: FlashMessagesService,
    private mainService: MainService,
  ) {
      this.serverAddress = this.mainService.getServerAddress();
  }

  registerUser(user) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/users/register', user, {headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/users/authenticate', user, {headers: headers})
      .map(res => res.json());
  }

  storeUserInfo(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  userLogout() {
    this.authToken = null;
    this.user = null;
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
  }

  authProfile(user) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/users/profile', user, {headers: headers})
      .map(res => res.json());
  }

  getToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  getUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  authUsername(user) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/users/forgotPassword/username', user, {headers: headers})
      .map(res => res.json());
  }

  changePassword(user) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/users/forgotPassword/answer', user, {headers: headers})
      .map(res => res.json());
  }

  updateProfile(user) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/users/updateProfile', user, {headers: headers})
      .map(res => res.json());
  }

  checkUsername(user) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/users/checkUsername', user, { headers: headers })
      .map(res => res.json());
  }

  getRoleFromServer() {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.get('http://' + this.serverAddress + '/users/getRole', { headers: headers })
      .map(res => res.json());
  }

  searchPeople(searchObj) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/users/searchPeople', searchObj, {headers: headers})
      .map(res => res.json());
  }

  countUsers(searchObj) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/users/countUsers', searchObj, {headers: headers})
      .map(res => res.json());
  }

  makeContentManager(user) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/users/makeContentManager', user, { headers: headers })
      .map(res => res.json());
  }

  getTeam() {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://' + this.serverAddress + '/users/getTeam', {headers: headers})
      .map(res => res.json());
  }

  handleError(error: any) {
    this.flashMessagesService.show(error.statusText || "Server Error. Contact admin if error persists", { cssClass: 'alert-danger', timeout: 2500 });
  }
}
