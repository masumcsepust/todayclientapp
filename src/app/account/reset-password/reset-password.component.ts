import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/account/user';
import { take } from 'rxjs';
import { ResetPassword } from 'src/app/shared/models/account/reset-password';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup = new FormGroup({});
  token: string = '';
  email: string = '';
  errorMessages: string[] = [];
  submitted: boolean = false;

  constructor(private accountService: AccountService
    , private sharedService: SharedService
    , private router: Router
    , private fb: FormBuilder
    , private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
      this.accountService.user$.pipe(take(1)).subscribe((user: User | null) => {
        if(user) {
          this.router.navigateByUrl('/');
        } else {
          this.activatedRoute.queryParamMap.subscribe((params: any) => {
            this.token = params.get('token');
            this.email = params.get('email');

            if(this.token && this.email) {
              this.initializeForm(this.email);
            } else {
              this.router.navigateByUrl('account/login');
            }
          })
        }
      })
    }

    initializeForm(username: string) {
      this.resetPasswordForm = this.fb.group({
        email: [{value: username, disabled: true}],
        newPassword: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(15)]]
      })
    }

    resetPassword() {
      this.submitted = true;
      this.errorMessages = [];
      if(this.resetPasswordForm.valid && this.token && this.email) {
        const model: ResetPassword = {
          token: this.token,
          email: this.email,
          newPassword: this.resetPasswordForm.get('newPassword')?.value
        }

        this.accountService.resetPassword(model).subscribe((res: any) => {
          this.sharedService.showNotification(true, res.value.title, res.value.message);
          this.router.navigateByUrl('account/login');
        }, error => {
          if(error.error.errors) {
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.message);
          }
        })
      }
    }
}
