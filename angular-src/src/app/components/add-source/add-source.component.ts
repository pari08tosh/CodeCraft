import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LearnService } from '../../services/learn.service';

@Component({
  selector: 'app-add-source',
  templateUrl: './add-source.component.html',
  styleUrls: ['./add-source.component.css']
})
export class AddSourceComponent implements OnInit {

  name: String;
  link: String;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private flashMessagesService: FlashMessagesService,
    private learnService: LearnService,
  ) { }

  ngOnInit() {
  }

  addSource() {
    if (!this.name || !this.link) {
      this.flashMessagesService.show('Please fill all fields marked in red.', { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    const newSource = {
      name: this.name,
      link: this.link,
    };

    this.learnService.addSource(newSource).subscribe(
      data => {
        if (data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.name = "";
          this.link = "";
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
        }
      },
      err => {
        this.learnService.handleError(err);
    });
  }

}
