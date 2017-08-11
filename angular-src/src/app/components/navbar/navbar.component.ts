import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LearnService } from '../../services/learn.service';
import { NotificationService } from'../../services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: Object = [];
  login: String;
  searchString: String;
  topicsList: String;
  loggedIn: Boolean;
  notificationList: any = [];
  newNotification: Boolean;
  notificationTimeout: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private activatedRoute: ActivatedRoute,
    private learnService: LearnService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.newNotification = false;
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.login = params['login'];
      if (this.authService.loggedIn()) {
        this.loggedIn = true;
      }
      if (this.login) {
        this.user = this.authService.getUser();
        this.updateNotification();
      }
    });
    if (this.authService.loggedIn()) {
      this.user = this.authService.getUser();
      this.updateNotification();
      setInterval(() => {
        if (this.loggedIn) {
          console.log("updating")
          this.updateNotification();
        }
      },120000);
    }
  }

  userLogout() {
    this.authService.userLogout();
    this.router.navigate(['/']);
    this.loggedIn = false;
    this.newNotification = false;
    clearTimeout(this.notificationTimeout);
  }

  search() {
    if (this.searchString === '') {
      return false;
    } else {
      this.router.navigate(['/search'], { queryParams: { search: "blogs", searchString: this.searchString, pn: 0 }});
      this.searchString='';
    }
  }

  notificationFunc(notification) {

    let index = this.notificationList.indexOf(notification);
    this.notificationList.splice(index, 1);
    if (this.notificationList.length === 0) {
      this.newNotification = false;
    }

    const data = {
      notificationId: notification._id,
      username: JSON.parse(localStorage.getItem('user')).username,
    }

    this.notificationService.markAsRead(data).subscribe(
      data => {
      },
      err => {
        this.notificationService.handleError(err);
    });
  }

  updateNotification() {
    this.notificationService.getUnreadNotifications(this.user).subscribe(
      data => {
        this.notificationList = data;
        if (this.notificationList.length > 0) {
          if (this.newNotification === false) {
            this.flashMessagesService.show(`You have new notifications`, { cssClass: 'alert-success', timeout: 3000 });
          }
          this.newNotification = true;
        } else {
          this.newNotification = false;
        }
      },
      err => {
        this.notificationService.handleError(err);
    });
  }
}
