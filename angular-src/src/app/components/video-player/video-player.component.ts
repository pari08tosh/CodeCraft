import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VgAPI } from 'videogular2/core';


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {

  @Input() videoUrl: String;
  @Input() autoplay: Boolean;

  api: VgAPI;
  playing: Boolean;



  constructor() { }

  ngOnInit() {
  }

  onPlayerReady(api:VgAPI) {
        this.api = api;
        this.api.getDefaultMedia().subscriptions.canPlay.subscribe(
        () => {
            if (this.autoplay) {
              this.api.play();
            }
        }
    );
    }

}
