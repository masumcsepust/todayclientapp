import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/shared/models/account/user';
import { ConfirmEmail } from 'src/app/shared/models/account/confirm-email';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {
  success: boolean = true;

  constructor(private accountService: AccountService,
    private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
      this.accountService.user$.pipe(take(1)).subscribe((user: User | null) => {
        if(user) {
          this.router.navigateByUrl("/");
        } else {
          this.activatedRoute.queryParamMap.subscribe((params: any) => {
            const confirmEmail: ConfirmEmail = {
              token: params.get('token'),
              email: params.get('email')
            };
            this.accountService.confirmEmail(confirmEmail).subscribe((res:any) => {
              this.sharedService.showNotification(true, res.value.title, res.value.message);
            }, error => {
              this.success = false;
              this.sharedService.showNotification(false, "failed", error.error);
            })
          });


        }
      })
    }

    resendEmailConfirmationLink() {
      this.router.navigateByUrl("/account/send-email/resend-email-confirmation-link/");
    }

}
