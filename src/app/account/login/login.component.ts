import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  errorMessages: string[] = [];
  returnUrl: string | null = null;

  constructor(private fb: FormBuilder
    , private accountService:AccountService
    , private sharedService:SharedService
    , private router: Router
    , private activateRoute: ActivatedRoute
    ) {
      this.accountService.user$.pipe(take(1)).subscribe((user : User | null) => {
        if(user) {
          this.router.navigateByUrl('/');
        } else {
          this.activateRoute.queryParamMap.subscribe((params: any) => {
            if(params) {
              this.returnUrl = params.get('returnUrl');
            }
          })
        }
      })
    }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  login() {
    this.submitted = true;
    this.errorMessages = [];
    //if(this.registerForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe((res: any) => {
        if(this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.router.navigateByUrl('/');
        }
      }, err => {
        if(err.error.errors) {
          this.errorMessages = err.error.errors
        } else {
          this.errorMessages.push(err.error)
        }
      });
    //}
  }
}
