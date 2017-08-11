import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LearnService } from '../../services/learn.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  topic: String;
  subtopic: String;
  name: String;
  videoNumber: number;
  playlist: any = [];
  videoUrl: String;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private flashMessagesService: FlashMessagesService,
    private learnService: LearnService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.topic = params['topic'];
      this.subtopic = params['subtopic'];
      this.name = params['name'];
      this.videoNumber = Number(params['number']);

      const playlist = {
        topic: this.topic,
        subtopic: this.subtopic,
        name: this.name,
      }

      this.learnService.getPlaylist(playlist).subscribe(
        data => {
          this.playlist = data;
          this.videoUrl = '/assets/videos/' + this.playlist.videos[this.videoNumber].fileName;
        },
        err => {
          this.learnService.handleError(err);
        }
      )
    });
  }

  activeFunc(index) {
      return {
        'list-group-item': true,
        'videoList': true,
        'active': (index === this.videoNumber),
      }
  }
}
