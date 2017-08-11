import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LearnService } from '../../services/learn.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-playlist',
  templateUrl: './add-playlist.component.html',
  styleUrls: ['./add-playlist.component.css']
})
export class AddPlaylistComponent implements OnInit {

  subtopic: String;
  topic: String;
  name: String;
  description: String;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private flashMessagesService: FlashMessagesService,
    private learnService: LearnService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.subtopic = params['subtopic'];
      this.topic = params['topic'];
    });
  }

  addPlaylist() {

    if (!this.name || ! this.description) {
        this.flashMessagesService.show(`Please fill all fields`, { cssClass: 'alert-success', timeout: 2000 });
        return false;
    }
    const playlist = {
      topic: this.topic,
      subtopic: this.subtopic,
      description: this.description,
      name: this.name,
    }

    this.learnService.addPlaylist(playlist).subscribe(
      data => {
        if (data.success) {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
            this.router.navigate(['/addVideo'], { queryParams: { subtopic: this.subtopic, topic: this.topic }});
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
        }
      },
      err => {
        this.learnService.handleError(err);
    });
  }



}
