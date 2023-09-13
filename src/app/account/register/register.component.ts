import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/shared/models/account/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];

  constructor(private accountService: AccountService
    , private fb: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    ) {
      this.accountService.user$.pipe(take(1)).subscribe((user: User | null) => {
        if(user) {
          this.router.navigateByUrl('/');
        }
      })
    }

    ngOnInit(): void {
      this.initializeForm();
    }

    initializeForm() {
      this.registerForm = this.fb.group({
        firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
        lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
        email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
      })
    }

    register() {
      this.submitted = true;
      this.errorMessages = [];
      //if(this.registerForm.valid) {
        this.accountService.register(this.registerForm.value).subscribe((res: any) => {
          this.sharedService.showNotification(true, res.value.title, res.value.message)
          this.router.navigateByUrl('/account/login');
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
