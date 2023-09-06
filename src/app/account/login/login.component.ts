import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  errorMessages: string[] = [];

  constructor(private fb: FormBuilder
    , private accountService:AccountService
    , private sharedService:SharedService
    ) {}

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
        console.log('====================================');
        console.log("login success");
        console.log('====================================');
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
