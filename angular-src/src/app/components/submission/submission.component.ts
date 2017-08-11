import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { CodeService } from '../../services/code.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {

  submissionId: String;
  submission: any = [];
  gotSubmission: Boolean = false;
  commentList: any = [];
  commentBody: String;
  username: String;
  loggedIn: Boolean;
  deleteCode: Boolean;
  deleteBtnText: String;

  constructor(
    private router: Router,
    private codeService: CodeService,
    private activatedRoute: ActivatedRoute,
    private commentService: CommentService,
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService,
  ) { }

  ngOnInit() {
    this.deleteCode = false;
    this.deleteBtnText = "Delete Code";
    this.gotSubmission = false;
    if (this.authService.loggedIn()) {
        this.loggedIn = true;
        this.username = JSON.parse(localStorage.getItem('user')).username;
    }
    this.activatedRoute.params.subscribe((params: Params) => {
      this.submissionId = params['id'];

      const submission = {
        id: this.submissionId,
      }

      this.codeService.getSubmissionById(submission).subscribe(
        data => {
          this.submission = data;
          this.gotSubmission = true;
          if (this.username === this.submission.username) {
            this.deleteCode = true;
          }
        },
        err => {
          this.codeService.handleError(err);
        }
      )

      const comment = {
        for: "code",
        id: this.submissionId,
      }

      this.commentService.searchComments(comment).subscribe(
      data => {
        this.commentList = data;
      },
      err => {
        this.codeService.handleError(err);
      });
    });
  }

  addComment() {
    const newComment = {
      for: "code",
      id: this.submissionId,
      username: this.username,
      body: this.commentBody,
      date: Date.now(),
      notificationFor: this.submission.username,
      notificationLink: `/submission/${ this.submissionId }`,
      notificationMessage: `${ this.username } commented on your code`,
    };
    this.commentBody = "";
    this.commentList.unshift(newComment);

    this.commentService.addComment(newComment).subscribe(data => {
      if (data.success) {
        this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
      } else {
        this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
      }
    },
    err => {
      this.codeService.handleError(err);
    },
  );
  }

  deleteCodeFunc() {
    if (this.deleteBtnText === "Delete Code") {
      this.deleteBtnText = "Click again to confirm";
      return false;
    } else {
      const code = {
        id: this.submissionId
      }
      this.codeService.deleteCode(code).subscribe(
        data => {
          if(data.success) {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 2000 });
            this.router.navigate(['/code']);
          } else {
              this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
          }
        },
        err => {
          this.codeService.handleError(err);
        });
    }
  }

}
