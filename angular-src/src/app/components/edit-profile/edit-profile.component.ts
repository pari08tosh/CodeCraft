import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  username: String;
  user: any = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private blogService:  BlogService,
    private activatedRoute: ActivatedRoute,
    private flashMessagesService: FlashMessagesService,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.username = params['username'];
      const user = {
        username: this.username,
      }
      this.authService.authProfile(user).subscribe(
        data => {
          this.user = data;
        },
        err => {
          this.authService.handleError(err);
      });
    });
  }

  submitForm() {
    if (!this.user.name || !this.user.email) {
      this.flashMessagesService.show(`Please fill all inputs marked in red`, { cssClass: 'alert-danger', timeout: 1500 });
      return false;
    }
    this.authService.updateProfile(this.user).subscribe(
      data => {
        if (data.success) {
          this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 1500 });
          this.router.navigate(['/users', this.username]);
        } else {
            this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 1500 });
            return false;
        }
      },
      err => {
        this.authService.handleError(err);
      });
  }
}
