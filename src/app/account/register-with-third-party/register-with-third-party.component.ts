import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { take } from 'rxjs';
import { RegisterWithExternal } from 'src/app/shared/models/account/registerWithExternal';

@Component({
  selector: 'app-register-with-third-party',
  templateUrl: './register-with-third-party.component.html',
  styleUrls: ['./register-with-third-party.component.css']
})
export class RegisterWithThirdPartyComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  provider: string | null = null;
  access_token: string | null = null;
  userId: string | null = null;
  errorMessages: string[] = [];

  constructor(private accountService: AccountService,
    private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder) {}
  ngOnInit()  {
    this.accountService.user$.pipe(take(1)).subscribe((user: any) => {
      if(user) {
        this.router.navigateByUrl('/');
      } else {
        this.activatedRoute.queryParamMap.subscribe((res: any) => {
          this.access_token =  res.get('access_token');
          this.provider = this.activatedRoute.snapshot.paramMap.get('provider');
          this.userId = res.get('userId');

          if(this.provider && this.access_token && this.userId &&
            (this.provider === 'facebook' || this.provider === 'google')) {
              this.initializeForm();
            } else {
              this.router.navigateByUrl('account/register');
            }
        })
      }
    })
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
    })
  }

 register() {
  this.submitted = true;
  this.errorMessages = [];
  if(this.provider && this.access_token && this.userId) {
    const firstname = this.registerForm.get('firstname')?.value;
    const lastname = this.registerForm.get('lastname')?.value;

    const model = new RegisterWithExternal(firstname, lastname, this.userId, this.access_token, this.provider);
    this.accountService.registerWithThirdParty(model).subscribe( _ => {
      this.router.navigateByUrl("/");
    }, error => {
      if(error.error.errors) {
        this.errorMessages = error.error.errors;
      } else {
        this.errorMessages.push(error.error);
      }
    });
  }
 }

}
