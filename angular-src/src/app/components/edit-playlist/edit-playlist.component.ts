import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LearnService } from '../../services/learn.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-playlist',
  templateUrl: './edit-playlist.component.html',
  styleUrls: ['./edit-playlist.component.css']
})
export class EditPlaylistComponent implements OnInit {

  topic: String;
  subtopic: String;
  name: String;
  description: String;
  playlist: any = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private flashMessagesService: FlashMessagesService,
    private learnService: LearnService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.subtopic = params['subtopic'];
      this.topic = params['topic'];
      this.name = params['name'];

      const playlist = {
        topic: this.topic,
        subtopic: this.subtopic,
        name: this.name,
      }
      console.log(playlist);

      this.learnService.getPlaylist(playlist).subscribe(
        data => {
          this.playlist = data;
          console.log(this.playlist);
        },
        err => {
          this.learnService.handleError(err);
      });
    });
  }

  editPlaylist() {
    const playlist = {
      id: this.playlist._id,
      name: this.playlist.name,
      description: this.playlist.description,
    }

    this.learnService.editPlaylist(playlist).subscribe(
      data => {
        if(data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          return;
        } else {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
            return;
        }
      },
      err => {
        this.learnService.handleError(err);
    });
  }

  deleteVideoFunc(index) {
    const video = {
      topic: this.topic,
      subtopic: this.subtopic,
      playlist: this.playlist.name,
      name: this.playlist.videos[index].name,
      fileName: this.playlist.videos[index].fileName,
    }

    this.learnService.deleteVideo(video).subscribe(
      data => {
        if(data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.playlist.videos.splice(index, 1);
          return;
        } else {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
            return;
        }
      },
      err => {
        this.learnService.handleError(err);
    });
  }
  deletePlaylistFunc() {
    const playlist = {
      topic: this.topic,
      subtopic: this.subtopic,
      playlist: this.playlist.name,
    }

    this.learnService.deletePlaylist(playlist).subscribe(
      data => {
        if (data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/learn']);
          return;
        } else {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
            return;
        }
      },
      err => {
        this.learnService.handleError(err);
    });
  }

}
