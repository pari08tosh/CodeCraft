import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { DiscussService } from '../../services/discuss.service';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {

  questionId: String;
  newQuestion: String;
  tags: String[] = [];
  tag: string;
  initialQuestion: String;
  deleteBtnText: String;
  username: String;
  initialQuestionAvailable: Boolean;

  constructor(
    private discussService: DiscussService,
    private flashMessagesService: FlashMessagesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.deleteBtnText = "Delete Question";
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.questionId = params['id'];

      const question = {
        id: this.questionId,
      }

      this.discussService.getQuestionById(question).subscribe(
        data => {
          this.initialQuestion = data.question;
          this.initialQuestionAvailable = true;
          this.tags = data.tags;
          this.username = data.username;
        }
      )
    });
  }

  tinyResponce(tinyBody: String) {
    this.newQuestion = tinyBody;
  }

  addTag() {
    this.tags.push(this.tag);
    this.tag = '';
  }

  removeTag(tag) {
    for(let ii = 0; ii < this.tags.length; ii++) {
      if (this.tags[ii] === tag) {
        this.tags.splice(ii, 1);
        break;
      }
    }
  }

  editQuestion() {
    if (!this.newQuestion) {
      this.flashMessagesService.show(`Please fill all fields`, { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    const question = {
      id: this.questionId,
      question: this.newQuestion,
      tags: this.tags,
      username: this.username,
    }

    this.discussService.editQuestion(question).subscribe(
      data => {
        if(data.success) {
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

    deleteQuestion() {
      if (this.deleteBtnText === "Delete Question") {
        this.deleteBtnText = "Click Again to Confirm";
        return false;
      }

      const question  = {
        id: this.questionId,
        username: this.username,
      }

      this.discussService.deleteQuestion(question).subscribe(
        data => {
          if(data.success) {
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
