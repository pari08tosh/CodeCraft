import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LearnService } from '../../services/learn.service';
import { AuthService } from '../../services/auth.service';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-add-study-file',
  templateUrl: './add-study-file.component.html',
  styleUrls: ['./add-study-file.component.css']
})
export class AddStudyFileComponent implements OnInit {

  subtopic: String;
  topic: String;
  name: String;
  serverAddress: String;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private flashMessagesService: FlashMessagesService,
    private learnService: LearnService,
    private authService: AuthService,
    private mainService: MainService,
  ) { }

  ngOnInit() {
    this.serverAddress = this.mainService.getServerAddress();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.subtopic = params['subtopic'];
      this.topic = params['topic'];
    });
  }

}
