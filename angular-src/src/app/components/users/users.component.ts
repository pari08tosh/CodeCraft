import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DiscussService } from '../../services/discuss.service';
import { BlogService } from '../../services/blog.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  username: String;
  blogList: any = [];
  blogDataAvailable: Boolean = false;
  email: String;
  name: String;
  editRights: Boolean;
  user: any = [];
  uploadImg: Boolean;
  showBlogs: Boolean;
  showQuestions: Boolean;
  questionList: any =[];
  questionDataAvailable: Boolean;
  contentManagerBtn: Boolean;
  serverAddress: String;

  constructor(
    private router: Router,
    private authService: AuthService,
    private blogService:  BlogService,
    private activatedRoute: ActivatedRoute,
    private discussService: DiscussService,
    private flashMessagesService: FlashMessagesService,
    private mainService: MainService,
  ) {
    this.serverAddress = mainService.getServerAddress();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.username = params['username'];
      const user = {
        username: this.username,
      }
      if (this.authService.loggedIn()) {
        this.authService.checkUsername(user).subscribe(
          data => {
            if (data.authentication) {
              this.editRights = true;
            }
          },
          err => {
            this.authService.handleError(err);
        });
      }
      this.authService.authProfile(user).subscribe(
        data => {
          this.user = data;
            if (AuthService.userRole === 'Admin') {
              if (this.user.role === 'Admin' || this.user.role === 'Content Manager') {
                this.contentManagerBtn = false;
              } else {
                this.contentManagerBtn = true;
              }
            }
          this.blogService.getBlogByUsername(user).subscribe(
            data => {
              this.blogList = data;
              this.blogDataAvailable = true;
            },
            err => {
              this.blogService.handleError(err);
            });
        },
        err => {
          this.authService.handleError(err);
        });

      this.discussService.getQuestionByUsername(user).subscribe(
        data => {
          this.questionList = data;
          this.questionDataAvailable = true;
        },
        err => {
          this.discussService.handleError(err);
        });
    });
  }

  editBtnFunc() {
    this.router.navigate(['/editProfile'], { queryParams: { username: this.username }});
  }

  uploadImgFunc() {
    this.uploadImg = true;
  }

  showBlogsFunc() {
    this.showQuestions = false;
    this.showBlogs = !this.showBlogs;
    setTimeout(()=> {
      window.scrollBy(0,300);
  },300);
}

  showQuestionsFunc() {
    this.showBlogs = false;
    this.showQuestions = !this.showQuestions;
    setTimeout(()=> {
      window.scrollBy(0,300);
  },300);
}

  contentManagerBtnFunc() {
    const user = {
      id: this.user._id,
      username: this.user.username,
    }

    this.authService.makeContentManager(user).subscribe(
      data => {
        if (data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
        }
      },
      err => {
        this.authService.handleError(err);
      }
    )
  }
}
