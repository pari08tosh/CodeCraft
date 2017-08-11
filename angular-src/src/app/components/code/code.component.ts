import { Component, OnInit, ViewChild } from '@angular/core';
import { CodeService } from '../../services/code.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit {

  title: String = "";
  language: String = 'c';
  privacy: String = 'public';
  userInput: String;
  showOutput: Boolean;
  showSpinner: Boolean;
  body: String;
  output: String  = "";
  showRuntime: Boolean;
  runtime: String;
  recentSubmissionsList: any = [];
  userSubmissionsList: any = [];
  saveChecked: Boolean;

  constructor(
    private codeService: CodeService,
    private flashMessagesService: FlashMessagesService,
  ) { }

  ngOnInit() {
    this.showOutput = false;
    this.showSpinner = false;
    this.showRuntime = false;
    this.saveChecked = false;
    this.codeService.getRecentSubmissions().subscribe(
      data => {
        this.recentSubmissionsList = data;
      },
      err => {
        this.codeService.handleError(err);
      }
    )

    this.codeService.getUserSubmissions().subscribe(
      data => {
        this.userSubmissionsList = data;
      },
      err => {
        this.codeService.handleError(err);
      }
    )
  }

  editorResponce(data: String) {
    this.body = data;
  }

  submitCode() {
    if (!this.title || !this.body) {
      this.flashMessagesService.show(`Please fill all fields marked in red`, { cssClass: 'alert-danger', timeout: 2500 });
      return 0;
    }
    this.showSpinner = true;
    this.showOutput = false;
    this.showRuntime = false;
    setTimeout(()=> {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
    const codeObj = {
      title: this.title,
      language: this.language,
      privacy: this.privacy,
      userInput: this.userInput,
      body: this.body,
      save: this.saveChecked,
    }
    this.codeService.submitCode(codeObj).subscribe(
      data => {
        this.showSpinner = false;
        this.showOutput = true;
        this.output = data.output;
        if (data.success) {
          this.runtime = data.runtime;
          this.showRuntime = true;
        }
        setTimeout(()=> {
          window.scrollTo(0, document.body.scrollHeight);
        }, 100);
      },
      err => {
        this.codeService.handleError(err);
      }
    )
  }

}
