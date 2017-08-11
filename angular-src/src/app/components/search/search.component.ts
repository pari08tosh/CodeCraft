import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { DiscussService } from '../../services/discuss.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchList: any;
  currentPage: number;
  searchCount: number;
  searchString: String;
  dataAvailable: Boolean = false;
  search: String; // to determine whether to search blogs or questions
  switchBtnText: String;

  constructor(
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private discussService: DiscussService,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
    this.currentPage = Number(params['pn']);
    this.searchString = params['searchString'];
    this.search = params['search'];

    const searchInfo = {
      searchString: this.searchString,
      pn: this.currentPage,
    }

    if (this.search === "blogs") {
      this.switchBtnText = "Search Questions";
      this.blogService.getBlogCount(searchInfo).subscribe(
        data => {
          this.searchCount = Number(data.count);
        },
        err => {
          this.blogService.handleError(err);
      });

      this.blogService.searchBlogs(searchInfo).subscribe(
        data => {
          this.searchList = data;
          this.dataAvailable = true;
        },
        err => {
          this.blogService.handleError(err);
        });
    } else {

      this.switchBtnText = "Search Blogs";
      this.discussService.getQuestionCount(searchInfo).subscribe(
        data => {
          this.searchCount = Number(data.count);
        },
        err => {
          this.discussService.handleError(err);
      });

      this.discussService.searchQuestion(searchInfo).subscribe(
        data => {
          this.searchList = data;
          this.dataAvailable = true;
        },
        err => {
          this.discussService.handleError(err);
      });
    }
    });
   }


   switchBtnFunc() {
     if (this.switchBtnText === "Search Questions") {
       this.router.navigate(['/search'], { queryParams: { search: "questions", searchString: this.searchString, pn: 0 }});
     } else {
       this.router.navigate(['/search'], { queryParams: { search: "blogs", searchString: this.searchString, pn: 0 }});
     }
   }

   prevPage() {
    if (!(this.currentPage > 0)) {
      return false;
    }
    this.router.navigate(['/search'], { queryParams: { search: this.search, searchString: this.searchString, pn: this.currentPage - 1 } });
     window.scrollTo(0,0);
   }

   nextPage() {
     if (!(this.currentPage < Math.floor(this.searchCount/10))) {
       return false;
     }
      this.router.navigate(['/search'], { queryParams: { search: this.search, searchString: this.searchString, pn: this.currentPage + 1 } });
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
       'disabled': !(this.currentPage < Math.floor(this.searchCount/10)),
     }
   }

}
