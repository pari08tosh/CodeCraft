import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-write-blog',
  templateUrl: './write-blog.component.html',
  styleUrls: ['./write-blog.component.css']
})
export class WriteBlogComponent implements OnInit {
  heading: String;
  body: String;
  tags: String[] = [];
  tag: string;

  constructor(
    private blogService: BlogService,
    private flashMessagesService: FlashMessagesService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  tinyResponce(tinyBody: String) {
    this.body = tinyBody;
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

  submitBlog() {
    if (!this.body || !this.heading) {
      this.flashMessagesService.show(`Please fill all fields`, { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }

    const blog = {
      heading: this.heading,
      body: this.body,
      tags: this.tags,
      username: JSON.parse(localStorage.getItem('user')).username,
    }
    this.blogService.addBlog(blog).subscribe(
      data => {
        if (data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/blogs'], { queryParams: { pn: 0 }});
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
          this.router.navigate(['/writeBlog']);
        }
      },
      err => {
        this.blogService.handleError(err);
      },
    );
  }
}
