import { Component, OnInit } from '@angular/core';
import { NewsFeedService } from '../../services/news-feed.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-write-feed',
  templateUrl: './write-feed.component.html',
  styleUrls: ['./write-feed.component.css']
})
export class WriteFeedComponent implements OnInit {
  heading: String;
  body: String;

  constructor(
    private newsFeedService: NewsFeedService,
    private flashMessagesService: FlashMessagesService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  tinyResponce(tinyBody: String) {
    this.body = tinyBody;
  }

  submitFeed() {
    if (!this.heading || !this.body) {
      this.flashMessagesService.show(`Please fill all fields`, { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    const newFeed = {
      heading: this.heading,
      body: this.body,
    }
    this.newsFeedService.addFeed(newFeed).subscribe(
      data => {
        if (data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/dashboard']);
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
        }
      },
      err => {
        this.newsFeedService.handleError(err);
      },
    )
  }

}
