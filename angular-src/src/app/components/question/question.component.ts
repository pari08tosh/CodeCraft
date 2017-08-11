import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { DiscussService } from '../../services/discuss.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  editable: Boolean;
  question: any = [];
  answerList: any = [];
  questionId: String;
  username: String;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private discussService: DiscussService,
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService,
  ) { }

  ngOnInit() {

    if (this.authService.loggedIn()) {
      this.username = JSON.parse(localStorage.getItem('user')).username;
    }
    this.activatedRoute.params.subscribe((params: Params) => {
      this.questionId = params['id'];

      const question = {
        id: this.questionId,
      }

      this.discussService.getQuestionById(question).subscribe(
        data => {
          this.question = data;
          const user = {
            username: this.question.username,
          };
          if (this.authService.loggedIn()) {
            this.authService.checkUsername(user).subscribe(
              data => {
                if (data.authentication) {
                  this.editable = true;
                }
              },
              err => {
                this.authService.handleError(err);
            });
          }
        },
        err => {
          this.discussService.handleError(err);
        });

        this.discussService.getAnswerByQuestion(question).subscribe(
          data => {
            this.answerList = data;
          },
          err => {
            this.discussService.handleError(err);

          });
    });
  }

  writeAnswerFunc() {
    this.router.navigate(['/writeAnswer', this.questionId]);
  }

  editAnswer(answer) {
    this.router.navigate(['/editAnswer'], { queryParams: { id: answer._id }});
  }

}
