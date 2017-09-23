import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MainService } from './main.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LearnService {

  serverAddress: String;
  token: any;

  constructor(
    private http: Http,
    private flashMessagesService: FlashMessagesService,
    private mainService: MainService,
  ) {
    this.serverAddress = this.mainService.getServerAddress();
   }


  addTopic(topic) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/topics/addTopic', topic, {headers: headers})
      .map(res => res.json());
  }

  getAllTopicNames() {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://' + this.serverAddress + '/topics/getAllTopicNames', {headers: headers})
      .map(res => res.json());
  }

  getTopic(topic) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/topics/getTopic', topic, {headers: headers})
      .map(res => res.json());
  }

  editTopic(topic) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/topics/editTopic', topic, {headers: headers})
      .map(res => res.json());
  }

  deleteTopic(topic) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/topics/deleteTopic', topic, {headers: headers})
      .map(res => res.json());
  }

  addSubtopic(subtopic) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/subtopics/addSubtopic', subtopic, {headers: headers})
      .map(res => res.json());
  }

  getAllSubtopicForTopic(subtopic) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/subtopics/getAllSubtopicForTopic', subtopic, {headers: headers})
      .map(res => res.json());
  }

  getSubtopic(subtopic) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/subtopics/getSubtopic', subtopic, {headers: headers})
      .map(res => res.json());
  }

  editSubtopic(subtopic) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/subtopics/editSubtopic', subtopic, {headers: headers})
      .map(res => res.json());
  }

  deleteSubtopic(subtopic) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/subtopics/deleteSubtopic', subtopic, {headers: headers})
      .map(res => res.json());
  }

  addSection(section) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/sections/addSection', section, {headers: headers})
      .map(res => res.json());
  }

  getAllSectionForSubtopic(section) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/sections/getAllSectionForSubtopic', section, {headers: headers})
      .map(res => res.json());
  }

  getSection(section) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/sections/getSection', section, {headers: headers})
      .map(res => res.json());
  }

  editSection(section) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/sections/editSection', section, {headers: headers})
      .map(res => res.json());
  }

  deleteSection(section) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/sections/deleteSection', section, {headers: headers})
      .map(res => res.json());
  }

  getEbooks(ebook) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/ebooks/getEbooksForContent', ebook, {headers: headers})
      .map(res => res.json());
  }

  deleteEbook(ebook) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/studyFiles/deleteEbook', ebook, {headers: headers})
      .map(res => res.json());
  }

  getStudyFiles(file) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/studyFiles/getStudyFilesForContent', file, {headers: headers})
      .map(res => res.json());
  }

  deleteStudyFile(file) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/studyFiles/deleteStudyFile', file, {headers: headers})
      .map(res => res.json());
  }

  addPlaylist(playlist) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/playlists/addPlaylist', playlist, {headers: headers})
      .map(res => res.json());
  }

  getPlaylistBySubtopic(playlist) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/playlists/getPlaylistBySubtopic', playlist, {headers: headers})
      .map(res => res.json());
  }

  getPlaylist(playlist) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/playlists/getPlaylist', playlist, {headers: headers})
      .map(res => res.json());
  }

  editPlaylist(playlist) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/playlists/editPlaylist', playlist, {headers: headers})
      .map(res => res.json());
  }

  deleteVideo(video) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/playlists/deleteVideo', video, {headers: headers})
      .map(res => res.json());
  }

  deletePlaylist(playlist) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/playlists/deletePlaylist', playlist, {headers: headers})
      .map(res => res.json());
  }

  addSource(newSource) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/sources/addSource', newSource, {headers: headers})
      .map(res => res.json());
  }

  getAllSources() {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://' + this.serverAddress + '/sources/getAllSource', {headers: headers})
      .map(res => res.json());
  }



  handleError(error: any) {
    this.flashMessagesService.show(error.statusText || "Server Error. Contact admin if error persists", { cssClass: 'alert-danger', timeout: 2500 });
  }
}
