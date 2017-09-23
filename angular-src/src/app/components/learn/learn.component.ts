import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LearnService } from '../../services/learn.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})
export class LearnComponent implements OnInit {

  topic: String;
  subtopic: String;
  section: String;
  backBtn: Boolean;
  backBtnUrl: String;
  editBtn: Boolean;
  navBarHeading: String;
  navBarList: String[] = [];
  addBtn: Boolean;
  content: any = [];
  ebooksList: any = [];
  filesList: any = [];
  contentSwitchValue: String = 'ebooks'; // Being Used to switch view for cover, text sections, ebooks and videos.
  deleteEbookBtn: Boolean;
  deleteFileBtn: Boolean;
  deleteEbookBtnText: String;
  deleteFileBtnText: String;
  playlists: any = [];
  test: String = '0';
  editPlaylistBtn: Boolean;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private flashMessagesService: FlashMessagesService,
    private learnService: LearnService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
      this.deleteEbookBtnText = "Delete Ebook";
      this.deleteFileBtnText = 'Delete File';
      if (this.authService.loggedIn()) {
        if (AuthService.userRole === 'Admin' || AuthService.userRole === 'Content Manager') {
          this.editBtn = true;
          this.addBtn = true;
          this.deleteEbookBtn = true;
          this.deleteFileBtn = true;
          this.editPlaylistBtn = true;
          }
        }
      this.activatedRoute.params.subscribe((params: Params) => {
        this.content.body = '';
        this.topic = params['topic'];
        this.subtopic = params['subtopic'];
        this.section = params['section'];
        this.navBarList = [];
        if (!this.topic) {

          // In the cover page. No topic specified.

          this.backBtn = false;
          this.navBarHeading = "Topics";
          this.contentSwitchValue = "cover";
          this.learnService.getAllTopicNames().subscribe(
            data=> {
              for(let ii = 0; ii < data.length; ii++) {
                this.navBarList.push(data[ii].name);
              }
            },
            err => {
              this.learnService.handleError(err);
            });

        } else {

          // In a topic (this.topic).

          this.backBtn = true;

          this.contentSwitchValue = "textContent";
          if (!this.subtopic) {
            this.backBtnUrl = '/learn';
            this.navBarHeading = "Subtopics"

            const topic = {
              name: this.topic,
            }

            this.learnService.getTopic(topic).subscribe(
              data => {
                this.content = data;
              },
              err => {
                this.learnService.handleError(err);
            });

            this.learnService.getAllSubtopicForTopic(topic).subscribe(
              data => {
                for(let ii = 0; ii < data.length; ii++) {
                  this.navBarList.push(data[ii].name);
                }

              },
              err=> {
                this.learnService.handleError(err);
              }
            )
          } else {

            // In a subtopic (this.subtopic).

            if (!this.section) {
              this.backBtnUrl = '/learn/' + this.topic;
              this.navBarHeading = "Sections";

              const Subtopic = {
                topic: this.topic,
                name: this.subtopic,
              }

              const ebook = {
                subtopic: this.subtopic,
                topic: this.topic,
              }

              const file = {
                subtopic: this.subtopic,
                topic: this.topic,
              }

              const playlist = {
                subtopic: this.subtopic,
                topic: this.topic,
              }

              this.learnService.getSubtopic(Subtopic).subscribe(
                data => {
                  this.content = data;
                  this.learnService.getAllSectionForSubtopic(Subtopic).subscribe(
                    data => {
                      for(let ii = 0; ii < data.length; ii++) {
                        this.navBarList.push(data[ii].name);
                      }

                      this.learnService.getEbooks(ebook).subscribe(
                        data => {
                          this.ebooksList = data;
                          if (data.length > 0) {
                            this.navBarList.push('Ebooks');
                          }
                        },
                        err => {
                          this.learnService.handleError(err);
                      });

                      this.learnService.getStudyFiles(file).subscribe(
                        data => {
                          this.filesList = data;
                          if (data.length > 0) {
                            this.navBarList.push('Study Files');
                          }
                        },
                        err => {
                          this.learnService.handleError(err);
                      });

                      this.learnService.getPlaylistBySubtopic(playlist).subscribe(
                        data => {
                          this.playlists = data;
                          if (data.length > 0) {
                            this.navBarList.push('Videos');
                          }
                        },
                        err => {
                          this.learnService.handleError(err);
                      });
                    },
                    err => {
                      this.learnService.handleError(err);
                  });
                },
                err => {
                  this.learnService.handleError(err);
              });

            } else {

              // In a section (this.section).

              this.backBtnUrl = '/learn/' + this.topic + '/' + this.subtopic;
              this.navBarHeading = "Sections";

              const section = {
                subtopic: this.subtopic,
                name: this.section,
                topic: this.topic,
              }

              const subtopic = {
                name: this.subtopic,
                topic: this.topic,
              }

              const playlist = {
                subtopic: this.subtopic,
                topic: this.topic,
              }

              const ebook = {
                subtopic: this.subtopic,
                topic: this.topic,
              }

              const file = {
                subtopic: this.subtopic,
                topic: this.topic,
              }

              this.learnService.getAllSectionForSubtopic(subtopic).subscribe(
                data => {
                  for(let ii = 0; ii < data.length; ii++) {
                    this.navBarList.push(data[ii].name);
                  }
                  // get ebooks
                  this.learnService.getEbooks(ebook).subscribe(
                    data => {
                      this.ebooksList = data;
                      if (data.length > 0) {
                        this.navBarList.push('Ebooks');
                      }
                    },
                    err => {
                      this.learnService.handleError(err);
                  });

                  // get study files

                  this.learnService.getStudyFiles(file).subscribe(
                    data => {
                      this.filesList = data;
                      if (data.length > 0) {
                        this.navBarList.push('Study Files');
                      }
                    },
                    err => {
                      this.learnService.handleError(err);
                  });

                  // get playlists
                  this.learnService.getPlaylistBySubtopic(playlist).subscribe(
                    data => {
                      this.playlists = data;
                      if(data.length > 0) {
                        this.navBarList.push('Videos');
                      }
                    },
                    err => {
                      this.learnService.handleError(err);
                  });
                },
                err => {
                  this.learnService.handleError(err);
              });

              // Determining in a text section, ebook section or video section.

              if (this.section === "Ebooks") {
                this.contentSwitchValue = "ebooks";
              } else {
                if (this.section === "Videos") {
                  this.contentSwitchValue = "videos";
                } else {
                  if ( this.section === 'Study Files') {
                    this.contentSwitchValue = 'studyFiles';
                  } else {
                    this.learnService.getSection(section).subscribe(
                      data => {
                        this.content = data;
                      },
                      err => {
                        this.learnService.handleError(err);
                    });
                  }
                }
              }
            }
          }
        }
      });
  }

  sideNavFunc(name) {
    if (this.section) {
      this.router.navigate(['/learn', this.topic, this.subtopic, name]);
    } else {
      if (this.subtopic) {
        this.router.navigate(['/learn', this.topic, this.subtopic, name]);
      } else {
        if (this.topic) {
          this.router.navigate(['/learn', this.topic, name]);
        } else {
          this.router.navigate(['/learn', name]);
        }
      }
    }
  }

  backBtnFunc() {
    this.router.navigate([this.backBtnUrl]);
  }

  addBtnFunc() {
    if (this.section) {
      this.router.navigate(['/addContent', this.topic, this.subtopic]);
    } else {
      if (this.subtopic) {
        this.router.navigate(['/addContent', this.topic, this.subtopic]);
      } else {
        if (this.topic) {
          this.router.navigate(['/addContent', this.topic]);
        } else {
          this.router.navigate(['/addContent']);
        }
      }
    }
  }

  activeFunc(name) {
      return {
        'list-group-item': true,
        'topicList': true,
        'active': (name === this.section),
      }
  }

  editBtnFunc() {
    if (this.section) {
      this.router.navigate(['/editContent', this.topic, this.subtopic, this.section]);
    } else {
      if (this.subtopic) {
        this.router.navigate(['/editContent', this.topic, this.subtopic]);
      } else {
        if (this.topic) {
          this.router.navigate(['/editContent', this.topic]);
        }
      }
    }
  }

  deleteEbookFunc(id) {
    const ebook = {
      id: id,
    }

    this.learnService.deleteEbook(ebook).subscribe(
      data => {
        if(data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/learn', this.topic, this.subtopic]);
        } else {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
        }
      },
      err => {
        this.learnService.handleError(err);
      });
    }

    deleteStudyFileFunc(id) {
      const file = {
        id: id,
      }

      this.learnService.deleteStudyFile(file).subscribe(
        data => {
          if(data.success) {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
            this.router.navigate(['/learn', this.topic, this.subtopic]);
          } else {
              this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
          }
        },
        err => {
          this.learnService.handleError(err);
        });
      }

    editPlaylistBtnFunc(name) {
      this.router.navigate(['/editPlaylist', this.topic, this.subtopic, name]);
    }

}
