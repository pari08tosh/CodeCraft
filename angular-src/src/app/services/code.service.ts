import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MainService } from './main.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CodeService {

  serverAddress: String;
  token: any;

  constructor(
    private http: Http,
    private flashMessagesService: FlashMessagesService,
    private mainService: MainService,
  ) {
    this.serverAddress = this.mainService.getServerAddress();
   }

   submitCode(codeObj) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     this.token = localStorage.getItem('id_token');
     headers.append('Authorization', this.token);
     return this.http.post('http://' + this.serverAddress + '/codes/submitCode', codeObj, {headers: headers})
       .map(res => res.json());
   }

   getUserSubmissions() {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     this.token = localStorage.getItem('id_token');
     headers.append('Authorization', this.token);
     return this.http.get('http://' + this.serverAddress + '/codes/getUserSubmissions', {headers: headers})
       .map(res => res.json());
   }

   getRecentSubmissions() {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     return this.http.get('http://' + this.serverAddress + '/codes/getRecentSubmissions', {headers: headers})
       .map(res => res.json());
   }
   getSubmissionById(submission) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     return this.http.post('http://' + this.serverAddress + '/codes/getSubmissionById', submission, {headers: headers})
       .map(res => res.json());
   }

   searchCodes(searchObj) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     return this.http.post('http://' + this.serverAddress + '/codes/searchCodes', searchObj, {headers: headers})
       .map(res => res.json());
   }

   countCodes(searchObj) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     return this.http.post('http://' + this.serverAddress + '/codes/countCodes', searchObj, {headers: headers})
       .map(res => res.json());
   }

   deleteCode(codeObj) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     this.token = localStorage.getItem('id_token');
     headers.append('Authorization', this.token);
     return this.http.post('http://' + this.serverAddress + '/codes/deleteCode', codeObj, {headers: headers})
       .map(res => res.json());
   }

   handleError(error: any) {
     this.flashMessagesService.show(error.statusText || "Server Error. Contact admin if error persists", { cssClass: 'alert-danger', timeout: 2500 });
   }

}
