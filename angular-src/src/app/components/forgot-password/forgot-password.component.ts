import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  usernameEntered: Boolean;
  username: String;
  answer: String;
  securityQuestion: String;
  password: String;

  constructor(
    private flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.usernameEntered = false;
  }

  submitUsernameForm() {
    const user = {
      username: this.username,
    }

    for(let key in user) {
      if(!user[key]) {
      this.flashMessagesService.show(`Please fill all fields marked in red`, { cssClass: 'alert-danger', timeout: 1500 });
      return false;
      }
    }

    this.authService.authUsername(user).subscribe(
      data => {
        if(data.success) {
          this.securityQuestion = data.securityQuestion;
          this.usernameEntered = true;
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
        }
      },
      err => {
        this.authService.handleError(err);
      });
  }

  submitAnswerForm() {
    const user = {
      username: this.username,
      password: this.password,
      answer: this.answer,
    }

    for(let key in user) {
      if(!user[key]) {
      this.flashMessagesService.show(`Please fill all fields marked in red`, { cssClass: 'alert-danger', timeout: 1500 });
      return false;
      }
    }

    this.authService.changePassword(user).subscribe(
      data => {
        if (data.success) {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
            this.router.navigate(['/login']);
        } else {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
            this.router.navigate(['/forgotPassword']);
        }
      },
      err => {
        this.authService.handleError(err);
    });
  }


}
