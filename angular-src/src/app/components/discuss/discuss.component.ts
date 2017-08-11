import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { DiscussService } from '../../services/discuss.service';

@Component({
  selector: 'app-discuss',
  templateUrl: './discuss.component.html',
  styleUrls: ['./discuss.component.css']
})
export class DiscussComponent implements OnInit {
  questionList: any;
  currentTag: String;
  currentPage: number;
  questionCount: number;
  dataAvailable: Boolean = false;

  constructor(
    private discussService: DiscussService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
    this.currentPage = Number(params['pn']);
      this.currentTag = params['tag'];

      if (!this.currentTag) {
        this.currentTag = null;
      }

      const questionInfo = {
        tag: this.currentTag,
        pn: this.currentPage
      }

      this.discussService.getQuestionCount(questionInfo).subscribe(
        data => {
        this.questionCount = Number(data.count);
        },
        err => {
          this.discussService.handleError(err);
        });

      this.discussService.getQuestions(questionInfo).subscribe(
        data => {
          this.questionList = data;
          this.dataAvailable = true;
        },
        err => {
          this.discussService.handleError(err);
        });
    });
  }

  prevPage() {
    if (!(this.currentPage > 0)) {
      return false;
    }
    if (this.currentTag === null) {
      this.router.navigate(['/discuss'], { queryParams: { pn: this.currentPage - 1 } });
    } else {
      this.router.navigate(['/discuss'], { queryParams: { tag: this.currentTag, pn: this.currentPage - 1} });
    }
    window.scrollTo(0,0);
  }

  nextPage() {
    if (!(this.currentPage < Math.floor(this.questionCount/10))) {
      return false;
    }
    if (this.currentTag === null) {
      this.router.navigate(['/discuss'], { queryParams: { pn: this.currentPage + 1 } })
    } else {
      this.router.navigate(['/discuss'], { queryParams: { tag: this.currentTag, pn: this.currentPage + 1} })
    }
    window.scrollTo(0,0);
  }

  prevBtn() {
    return {
      'btn': true,
      'btn-sm': true,
      'btn-primary': true,
      'disabled': !(this.currentPage > 0),
    }
  }

  nextBtn() {
    return {
      'btn': true,
      'btn-sm': true,
      'btn-primary': true,
      'disabled': !(this.currentPage < Math.floor(this.questionCount/10)),
    }
  }

}
