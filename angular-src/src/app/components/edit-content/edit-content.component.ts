import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { LearnService } from '../../services/learn.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.css']
})
export class EditContentComponent implements OnInit {
  topic: String;
  subtopic: String;
  section: String;
  name: String;
  currentBody: String;
  body: String;
  type: String;
  deleteBtnText: String;
  currentBodyAvailable: Boolean;
  id: String;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private flashMessagesService: FlashMessagesService,
    private learnService: LearnService,
  ) { }

  ngOnInit() {
    this.deleteBtnText = "Delete Content";

    this.activatedRoute.params.subscribe((params: Params) => {
      this.topic = params['topic'];
      this.subtopic = params['subtopic'];
      this.section = params['section'];

      if (this.section) {
        this.type = "Section";
        const section = {
          subtopic: this.subtopic,
          name: this.section,
          topic: this.topic,
        }
        this.learnService.getSection(section).subscribe(
          data => {
            this.id = data._id;
            this.name = data.name;
            this.currentBody = data.body;
            this.currentBodyAvailable = true;
          },
          err => {
            this.learnService.handleError(err);
        });
      } else {
        if (this.subtopic) {
          this.type = "Subtopic";
          const subtopic = {
            topic: this.topic,
            name: this.subtopic,
          }
          this.learnService.getSubtopic(subtopic).subscribe(
            data => {
              this.id = data._id;
              this.name = data.name;
              this.currentBody = data.body;
              this.currentBodyAvailable = true;

            },
            err => {
              this.learnService.handleError(err);
          });
        } else {
          this.type = "Topic";
          const topic = {
            name: this.topic,
          }
          this.learnService.getTopic(topic).subscribe(
            data => {
              this.id = data._id;
              this.name = data.name;
              this.currentBody = data.body;
              this.currentBodyAvailable = true;

            },
            err => {
              this.learnService.handleError(err);
          });
        }
      }
    })
  }

  tinyResponce(tinyBody: String) {
    this.body = tinyBody;
  }

  editContent() {
    if (!this.name || !this.body) {
      this.flashMessagesService.show(`Please fill all fields`, { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    if (this.section) {
      const section = {
        id: this.id,
        name: this.name,
        body: this.body,
      }
      this.learnService.editSection(section).subscribe(
        data => {
          if(data.success) {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
            this.router.navigate(['/learn']);
          } else {
              this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
              return;
          }
      },
      err => {
        this.learnService.handleError(err);
      }
    )
    } else {
      if (this.subtopic) {
        const subtopic = {
          id: this.id,
          name: this.name,
          body: this.body,
        }
        this.learnService.editSubtopic(subtopic).subscribe(
          data => {
            if(data.success) {
              this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
              this.router.navigate(['/learn']);
            } else {
                this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
                return;
            }
        },
        err => {
          this.learnService.handleError(err);
        }
      );
      } else {
        const topic = {
          id: this.id,
          name: this.name,
          body: this.body,
        }
        this.learnService.editTopic(topic).subscribe(
          data => {
            if(data.success) {
              this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
              this.router.navigate(['/learn']);
            } else {
                this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
                return;
            }
          },
          err => {
            this.learnService.handleError(err);
          }
        );
      }
    }
  }

  deleteFunc() {

    if (this.deleteBtnText === "Delete Content") {
      this.deleteBtnText = "Click again to confirm";
      return false;
    }

    if (this.section) {
      const section = {
        name: this.section,
        subtopic: this.subtopic,
        topic: this.topic,
      }

      this.learnService.deleteSection(section).subscribe(
        data => {
          if(data.success) {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
            this.router.navigate(['/learn']);
          } else {
              this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
              return;
          }
      },
      err => {
        this.learnService.handleError(err);
      });
    } else {
      if (this.subtopic) {
        const subtopic = {
          name: this.subtopic,
          topic: this.topic,
        }

        this.learnService.deleteSubtopic(subtopic).subscribe(
          data => {
            if(data.success) {
              this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
              this.router.navigate(['/learn']);
            } else {
                this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
                return;
            }
        },
        err => {
          this.learnService.handleError(err);
        });
      } else {
        const topic = {
          name: this.topic,
        }

        this.learnService.deleteTopic(topic).subscribe(
          data => {
            if(data.success) {
              this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
              this.router.navigate(['/learn']);
            } else {
                this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
                return;
            }
        },
        err => {
          this.learnService.handleError(err);
        });
      }
    }
  }
}
