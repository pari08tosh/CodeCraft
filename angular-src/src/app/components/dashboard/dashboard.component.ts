import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { DiscussService } from '../../services/discuss.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NewsFeedService } from '../../services/news-feed.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  blogList: any = [];
  questionList: any = [];
  feedList: any = [];
  editRights: Boolean;

  constructor(
    private discussService: DiscussService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService,
    private newsFeedService: NewsFeedService,
  ) { }

  ngOnInit() {
    if (AuthService.userRole === 'Admin' || AuthService.userRole === 'Content Manager') {
      this.editRights = true;
    }
    const blogInfo = {
      tag: null,
      pn: 0,
    }
    this.blogService.getBlogs(blogInfo).subscribe(
      data => {
        this.blogList = data;
        this.blogList = this.blogList.slice(0,5);
      },
      err => {
        this.blogService.handleError(err);
      }
    );
    const questionInfo = {
      tag: null,
      pn: 0,
    }
    this.discussService.getQuestions(questionInfo).subscribe(
      data => {
        this.questionList = data;
        this.questionList = this.questionList.splice(0,5);
      },
      err => {
        this.discussService.handleError(err);
      }
    );

    this.newsFeedService.getAllFeed().subscribe(
      data => {
        this.feedList = data;
      },
      err => {
        this.newsFeedService.handleError(err);
      }
    );
  }

  deleteFeed(feed) {
    const deleteFeed = {
      id: feed._id,
    }

    this.newsFeedService.deleteFeed(deleteFeed).subscribe(
      data => {
        if(data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/']);
        } else {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
        }
      },
      err => {
        this.discussService.handleError(err);
      }
    )
  }
}
