import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FeedbackService } from '../../services/feedback.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})

export class FeedbackComponent implements OnInit {

  isAdmin: Boolean = false;
  feedbackList: any = [];
  subject: String;
  body: String;
  userFeedbackList: any = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private flashMessagesService: FlashMessagesService,
    private feedbackService: FeedbackService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
        if (AuthService.userRole === 'Admin') {
          this.isAdmin = true;
          this.feedbackService.getAllFeedback().subscribe(
            data => {
              this.feedbackList = data;
            },
            err => {
              this.feedbackService.handleError(err);
          });
        } else {
          this.feedbackService.getFeedbackByUsername().subscribe(
            data => {
              this.userFeedbackList = data;
            },
            err => {
              this.feedbackService.handleError(err);
            }
          );
        }
  }

  sendFeedback() {

    if (!this.body || !this.subject) {
      this.flashMessagesService.show('Please fill all fields marked in red.', { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }

    const newFeedback =  {
      subject: this.subject,
      body: this.body,
    }

    this.feedbackService.addFeedback(newFeedback).subscribe(
      data => {
        if (data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/']);
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
        }
      },
      err => {
        this.feedbackService.handleError(err);
    });
  }

  submitFeedback(feedback, reply) {
    const newReply = {
      id: feedback._id,
      username: feedback.username,
      message: reply,
    }

    this.feedbackService.replyToFeedback(newReply).subscribe(
      data => {
        if (data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          feedback.reply = reply;
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
        }
      }
    )
  }
}
