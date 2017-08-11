import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  username: String;
  password: String;
  email: String;
  securityQuestion: String;
  securityAns: String;

  constructor(
    private validateService: ValidateService,
    private flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  submitRegisterForm() {

    const user = {
      name: this.name,
      username: this.username,
      password: this.password,
      email: this.email,
      securityQuestion: this.securityQuestion,
      securityAns: this.securityAns
    }

    // Validate required fields
    for(let key in user) {
      if(!user[key]) {
      this.flashMessagesService.show(`Please fill all fields marked in red`, { cssClass: 'alert-danger', timeout: 1500  });
      return false;
      }
    }
    // Validate Email
    if(!this.validateService.validateEmail(this.email)) {
      this.flashMessagesService.show('Enter a valid email-id', { cssClass: 'alert-danger', timeout: 1500 });
      return false;
    }

    // Register User
    this.authService.registerUser(user).subscribe(
      data => {
        if(data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/login']);
        } else {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
          this.router.navigate(['/register']);
        }
      },
      err => {
        this.authService.handleError(err);
      });
  }

}
