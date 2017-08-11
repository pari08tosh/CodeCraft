import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-search-people',
  templateUrl: './search-people.component.html',
  styleUrls: ['./search-people.component.css']
})
export class SearchPeopleComponent implements OnInit {
  searchString: String;
  currentPage: number;
  userList: any;
  search: Boolean;
  userCount: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.searchString = params['searchString'];
      this.currentPage = Number(params['pn']);
      if (!this.currentPage) {
        this.currentPage = 0;
      }
      if (!this.searchString) {
        this.search = false;
        this.searchString = '';
      } else {
        this.search = true;
      }
      const searchObj = {
        searchString: this.searchString,
        pn: this.currentPage,
      }

      this.authService.countUsers(searchObj).subscribe(
        data => {
          this.userCount = Number(data.count);
        },
        err => {
          this.authService.handleError(err);
        }
      )

      this.authService.searchPeople(searchObj).subscribe(
        data => {
          this.userList = data;
        },
        err => {
          this.authService.handleError(err);
      });
    })
  }

  prevPage() {
    if (!(this.currentPage > 0)) {
        return false;
    }
    this.router.navigate(['/searchPeople'], { queryParams: { pn: this.currentPage - 1, searchString: this.searchString }})
    window.scrollTo(0,0);
  }

  nextPage() {
    if (!(this.currentPage < Math.floor(this.userCount/20))) {
      return false;
    } else {
      this.router.navigate(['/searchPeople'], { queryParams: { pn: this.currentPage + 1, searchString: this.searchString }})
      window.scrollTo(0,0);
    }
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
      'disabled': !(this.currentPage < Math.floor(this.userCount/20)),
    }
  }

}
