import { Component, OnInit } from '@angular/core';
import { DiscussService } from '../../services/discuss.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-write-answer',
  templateUrl: './write-answer.component.html',
  styleUrls: ['./write-answer.component.css']
})
export class WriteAnswerComponent implements OnInit {
  questionId: String;
  body: String;
  question: any = [];

  constructor(
    private discussService: DiscussService,
    private flashMessagesService: FlashMessagesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.questionId = params['id'];

      const question = {
        id: this.questionId,
      }
      this.discussService.getQuestionById(question).subscribe(
        data => {
          this.question = data;
        },
        err => {
          this.discussService.handleError(err);
      });
    });
  }

  tinyResponce(tinyBody: String) {
    this.body = tinyBody;
  }

  submitAnswer() {
    if (!this.body) {
      this.flashMessagesService.show(`Please fill all fields`, { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }

    const answer = {
      username: JSON.parse(localStorage.getItem('user')).username,
      body: this.body,
      questionId: this.questionId,
      notificationFor: this.question.username,
      notificationLink: `/question/${ this.questionId }`,
      notificationMessage: `${ this.question.username } answered your question`,
    }
    this.discussService.addAnswer(answer).subscribe(
      data => {
        if (data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/discuss'], { queryParams: { pn: 0 }});
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
        }
      },
      err => {
        this.discussService.handleError(err);
      });
  }

}
