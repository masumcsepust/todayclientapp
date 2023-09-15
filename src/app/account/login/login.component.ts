import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/shared/models/account/user';
import { LoginWithExternal } from 'src/app/shared/models/account/loginWithExternal';
import { DOCUMENT } from '@angular/common';
import { __decorate } from 'tslib';
import { CredentialResponse } from 'google-one-tap';
import jwt_decode from 'jwt-decode';

declare const FB: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('googleButton', {static: true}) googleButton: ElementRef = new ElementRef({});
  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  errorMessages: string[] = [];
  returnUrl: string | null = null;


  constructor(private fb: FormBuilder
    , private accountService:AccountService
    , private sharedService:SharedService
    , private router: Router
    , private activateRoute: ActivatedRoute
    , private renderer2: Renderer2
    , @Inject(DOCUMENT) private _document: Document
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
    this.inititalizeGoogleButton();
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    var script1 = this.renderer2.createElement("script");
    script1.src = "https://accounts.google.com/gsi/client";
    script1.async= true;
    script1.defer= true;
    this.renderer2.appendChild(this._document.body, script1);
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

  resendEmailConfirmationLink() {
    this.router.navigateByUrl("/account/send-email/resend-email-confirmation-link/");
  }

  loginWithFacebook() {
    FB.login(async (fbResult:any) => {
      if(fbResult.authResponse) {
        const accessToken = fbResult.authResponse.accessToken;
        const userId = fbResult.authResponse.userID;
        const model = new LoginWithExternal(userId, accessToken, 'facebook');
        this.accountService.loginWithThirdParty(model).subscribe( () => {
          if(this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigateByUrl("/");
          }
        }, error => {
          if(error.error.errors) {
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.error);
          }
        });
      }
    })
  }

  private inititalizeGoogleButton() {
    (window as any).onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: '632776576477-4eoik7smmj4fik558a6j3dnhi37kmt51.apps.googleusercontent.com',
        callback: this.googleCallBack.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      //@ts-ignore
      google.accounts.id.renderButton(
        this.googleButton.nativeElement,
        {size: 'medium', shape: 'rectangular', text: 'signin_with', logo_alignment: 'center'}
      )
    }
  }

  private async googleCallBack(response: CredentialResponse) {
    const jwtDecode: any = jwt_decode(response.credential);

    const model = new LoginWithExternal(jwtDecode.sub, response.credential, "google");
    this.accountService.loginWithThirdParty(model).subscribe( () => {
      if(this.returnUrl) {
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.router.navigateByUrl("/");
      }
    }, error => {
      this.sharedService.showNotification(false, "failed", error.error);
    });
  }
}
