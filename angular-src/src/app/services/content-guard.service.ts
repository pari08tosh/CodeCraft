import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { MainService } from './main.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ContentGuardService {

  response: any;
  token: any;
  // Server Address
  serverAddress: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private mainService: MainService,
    private http: Http,
  ) {
      this.serverAddress = this.mainService.getServerAddress();
   }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url = state.url;
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.get('http://' + this.serverAddress + '/users/getRole', { headers: headers })
      .map(res => {
        if(res.json().role === 'Admin' || res.json().role === 'Content Manager') {
          return true;
        } else {
          this.flashMessagesService.show('You are not authorized', { cssClass: 'alert-danger', timeout: 2500 });
          this.router.navigate(['/']);
          return false;
        }
      });
  }
}
