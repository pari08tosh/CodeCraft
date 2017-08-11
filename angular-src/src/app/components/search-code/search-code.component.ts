import { Component, OnInit } from '@angular/core';
import { CodeService } from '../../services/code.service';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-search-code',
  templateUrl: './search-code.component.html',
  styleUrls: ['./search-code.component.css']
})
export class SearchCodeComponent implements OnInit {
  searchString: String;
  currentPage: number;
  codeList: any;
  search: Boolean;
  codeCount: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private codeService: CodeService,
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

      this.codeService.countCodes(searchObj).subscribe(
        data => {
          this.codeCount = Number(data.count);
        },
        err => {
          this.codeService.handleError(err);
        }
      )

      this.codeService.searchCodes(searchObj).subscribe(
        data => {
          this.codeList = data;
        },
        err => {
          this.codeService.handleError(err);
      });
    })
  }

  prevPage() {
    if (!(this.currentPage > 0)) {
        return false;
    }
    this.router.navigate(['/searchCodes'], { queryParams: { pn: this.currentPage - 1, searchString: this.searchString }})
    window.scrollTo(0,0);
  }

  nextPage() {
    if (!(this.currentPage < Math.floor(this.codeCount/20))) {
      return false;
    } else {
      this.router.navigate(['/searchCodes'], { queryParams: { pn: this.currentPage + 1, searchString: this.searchString }})
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
      'disabled': !(this.currentPage < Math.floor(this.codeCount/20)),
    }
  }

}
