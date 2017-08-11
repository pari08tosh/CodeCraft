import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  blogList: any;
  currentTag: String;
  currentPage: number;
  blogCount: number;
  dataAvailable: Boolean = false;

  constructor(
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
    this.currentPage = Number(params['pn']);
      this.currentTag = params['tag'];

      if (!this.currentTag) {
        this.currentTag = null;
      }

      const blogInfo = {
        tag: this.currentTag,
        pn: this.currentPage
      }

      this.blogService.getBlogCount(blogInfo).subscribe(
        data => {
        this.blogCount = Number(data.count);
        },
        err => {
          this.blogService.handleError(err);
        });

      this.blogService.getBlogs(blogInfo).subscribe(
        data => {
          this.blogList = data;
          this.dataAvailable = true;
        },
        err => {
          this.blogService.handleError(err);
        });
    });
   }

   prevPage() {
     if (!(this.currentPage > 0)) {
         return false;
     }
     if (this.currentTag === null) {
       this.router.navigate(['/blogs'], { queryParams: { pn: this.currentPage - 1 } });
     } else {
       this.router.navigate(['/blogs'], { queryParams: { tag: this.currentTag, pn: this.currentPage - 1} });
     }
     window.scrollTo(0,0);
   }

   nextPage() {
     if (!(this.currentPage < Math.floor(this.blogCount/10))) {
       return false;
     }
     if (this.currentTag === null) {
       this.router.navigate(['/blogs'], { queryParams: { pn: this.currentPage + 1 } })
     } else {
       this.router.navigate(['/blogs'], { queryParams: { tag: this.currentTag, pn: this.currentPage + 1} })
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
       'disabled': !(this.currentPage < Math.floor(this.blogCount/10)),
     }
   }
}
