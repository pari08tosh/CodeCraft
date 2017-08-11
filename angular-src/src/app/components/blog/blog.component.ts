import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  blogId: String;
  currentBlog: any = [];
  editable: Boolean;
  username: String;
  commentList: any;
  commentBody: String;
  loggedIn: Boolean;

  constructor(
    private router: Router,
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private commentService: CommentService,
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService,
  ) { }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.loggedIn = true;
    }
    this.activatedRoute.params.subscribe((params: Params) => {
      this.blogId = params['id'];

      const blog = {
        id: this.blogId,
      }

      const comment = {
        for: "blog",
        id: this.blogId,
      }

      this.blogService.getBlogById(blog).subscribe(data => {
        this.currentBlog = data;
        this.username = JSON.parse(localStorage.getItem('user')).username;
        const user = {
          username: this.currentBlog.username,
        }
        this.authService.checkUsername(user).subscribe(
          data => {
            if (data.authentication) {
              this.editable = true;
            }
          },
          err => {
            this.authService.handleError(err);
        });
      },
      err => {
        this.blogService.handleError(err);
      },
    );
      this.commentService.searchComments(comment).subscribe(data => {
        this.commentList = data;
      },
      err => {
        this.blogService.handleError(err);
      },
    );
    });
  }

  addComment() {
    const newComment = {
      for: "blog",
      id: this.blogId,
      username: this.username,
      body: this.commentBody,
      date: Date.now(),
      notificationFor: this.currentBlog.username,
      notificationLink: `/blog/${ this.blogId }`,
      notificationMessage: `${ this.username } commented on your blog`,
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
      this.blogService.handleError(err);
    },
  );
  }

}
