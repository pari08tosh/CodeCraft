import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LearnService } from '../../services/learn.service';

@Component({
  selector: 'app-add-content',
  templateUrl: './add-content.component.html',
  styleUrls: ['./add-content.component.css']
})
export class AddContentComponent implements OnInit {

  topic: String;
  subtopic: String;
  name: String;
  body: String;
  type: String;
  addEbook: Boolean;
  addVideo: Boolean;
  addFile: Boolean;

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
      if (!this.topic) {
        this.type = 'Topic';
      } else {
        if (!this.subtopic) {
          this.type = 'Subtopic';
        } else {
          this.addEbook = true;
          this.addVideo = true;
          this.addFile = true;
          this.type = 'Section';
        }
      }
    });
  }

  tinyResponce(tinyBody: String) {
    this.body = tinyBody;
  }

  submitContent() {

    if (!this.name || !this.body) {
      this.flashMessagesService.show(`Please fill all fields`, { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    if (this.type ==='Topic') {
      const topic = {
        name: this.name,
        body: this.body,
        notificationLink: `/learn/${ this.name }`,
        notificationMessage: `New topic added - ${ this.name }`,
      }

      this.learnService.addTopic(topic).subscribe(
        data => {
          if (data.success) {
              this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
                this.router.navigate(['/learn']);
          } else {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
          }
        },
        err => {
          this.learnService.handleError(err);
      });
    } else {
      if (this.type === 'Subtopic') {
        const subtopic = {
          name: this.name,
          body: this.body,
          topic: this.topic,
          notificationLink: `/learn/${ this.topic }/${ this.name }`,
          notificationMessage: `New subtopic added - ${ this.name }`,
        };

        this.learnService.addSubtopic(subtopic).subscribe(
          data => {
            if (data.success) {
                this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
                  this.router.navigate(['/learn']);
            } else {
              this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
            }
          },
          err => {
            this.learnService.handleError(err);
        });
      } else {
        const section = {
          name: this.name,
          body: this.body,
          topic: this.topic,
          subtopic: this.subtopic,
          notificationLink: `/learn/${ this.topic }/${ this.subtopic }/${ this.name }`,
          notificationMessage: `New section added - ${ this.name }`,
        }

        this.learnService.addSection(section).subscribe(
          data => {
            if (data.success) {
                this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
                this.router.navigate(['/learn']);
            } else {
              this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
            }
          },
          err => {
            this.learnService.handleError(err);
        });
      }
    }
  }

  addEbookFunc() {
    this.router.navigate(['/addEbook'], { queryParams: { subtopic: this.subtopic, topic: this.topic }});
  }

  addStudyFileFunc() {
    this.router.navigate(['/addStudyFile'], { queryParams: { subtopic: this.subtopic, topic: this.topic }});
  }

  addVideoFunc() {
      this.router.navigate(['/addVideo'], { queryParams: { subtopic: this.subtopic, topic: this.topic }});
  }
}
