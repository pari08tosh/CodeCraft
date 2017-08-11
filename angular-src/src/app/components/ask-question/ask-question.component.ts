import { Component, OnInit } from '@angular/core';
import { DiscussService } from '../../services/discuss.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css']
})
export class AskQuestionComponent implements OnInit {
  question: String;
  tags: String[] = [];
  tag: string;

  constructor(
    private discussService: DiscussService,
    private flashMessagesService: FlashMessagesService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  tinyResponce(tinyBody: String) {
    this.question = tinyBody;
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

  submitQuestion() {
    if (!this.question) {
      this.flashMessagesService.show(`Please fill all fields`, { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    const question = {
      question: this.question,
      tags: this.tags,
      username: JSON.parse(localStorage.getItem('user')).username,
    }
    this.discussService.addQuestion(question).subscribe(
      data => {
        if (data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/discuss'], { queryParams: { pn: 0 }});
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
          this.router.navigate(['/askQuestion']);
        }
      },
      err => {
        this.discussService.handleError(err);
      },
    );
  }
}
