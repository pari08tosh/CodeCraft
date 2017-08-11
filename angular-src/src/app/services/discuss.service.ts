import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MainService } from './main.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DiscussService {
  serverAddress: String;
  token: any;

  constructor(
    private http: Http,
    private flashMessagesService: FlashMessagesService,
    private mainService: MainService,
  ) {
      this.serverAddress = this.mainService.getServerAddress();
   }

   addQuestion(question) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     this.token = localStorage.getItem('id_token');
     headers.append('Authorization', this.token);
     return this.http.post('http://' + this.serverAddress + '/questions/addQuestion', question, {headers: headers})
       .map(res => res.json());
   }

   getQuestionCount(questionInfo) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     return this.http.post('http://' + this.serverAddress + '/questions/countQuestions', questionInfo, {headers: headers})
       .map(res => res.json());
   }

   getQuestions(questionInfo) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     return this.http.post('http://' + this.serverAddress + '/questions', questionInfo, {headers: headers})
       .map(res => res.json());
   }

   getQuestionById(question) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     return this.http.post('http://' + this.serverAddress + '/questions/getQuestionById', question, {headers: headers})
       .map(res => res.json());
   }

   getQuestionByUsername(question) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     return this.http.post('http://' + this.serverAddress + '/questions/getQuestionByUsername', question, {headers: headers})
       .map(res => res.json());
   }

   searchQuestion(question) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     return this.http.post('http://' + this.serverAddress + '/questions/searchQuestions', question, {headers: headers})
       .map(res => res.json());
   }

   editQuestion(question) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     this.token = localStorage.getItem('id_token');
     headers.append('Authorization', this.token);
     return this.http.post('http://' + this.serverAddress + '/questions/editQuestion', question, {headers: headers})
       .map(res => res.json());
   }

   deleteQuestion(question) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     this.token = localStorage.getItem('id_token');
     headers.append('Authorization', this.token);
     return this.http.post('http://' + this.serverAddress + '/questions/deleteQuestion', question, {headers: headers})
       .map(res => res.json());
   }

   getAnswerByQuestion(question) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     return this.http.post('http://' + this.serverAddress + '/answers/getAnswerByQuestion', question, {headers: headers})
       .map(res => res.json());
   }

   getAnswerById(answer) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     return this.http.post('http://' + this.serverAddress + '/answers/getAnswerById', answer, {headers: headers})
       .map(res => res.json());
   }

   addAnswer(answer) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     this.token = localStorage.getItem('id_token');
     headers.append('Authorization', this.token);
     return this.http.post('http://' + this.serverAddress + '/answers/addAnswer', answer, {headers: headers})
       .map(res => res.json());
   }

   editAnswer(answer) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     this.token = localStorage.getItem('id_token');
     headers.append('Authorization', this.token);
     return this.http.post('http://' + this.serverAddress + '/answers/editAnswer', answer, {headers: headers})
       .map(res => res.json());
   }

   deleteAnswer(answer) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     this.token = localStorage.getItem('id_token');
     headers.append('Authorization', this.token);
     return this.http.post('http://' + this.serverAddress + '/answers/deleteAnswer', answer, {headers: headers})
       .map(res => res.json());
   }

   handleError(error: any) {
     this.flashMessagesService.show(error.statusText || "Server Error. Contact admin if error persists", { cssClass: 'alert-danger', timeout: 2500 });
   }

}
