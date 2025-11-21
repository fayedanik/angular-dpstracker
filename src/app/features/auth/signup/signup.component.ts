import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize, of } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { ErrorMessageConst } from '../../../shared/consts/errorMessage.const';
import { MaterialModule } from '../../../shared/modules/material.module';
import { ToastMessageService } from '../../../shared/services/toast-message.service';
import { passwordsMatchValidator } from '../../../shared/utils/form-Validator';

@Component({
  selector: 'app-signup',
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _userService = inject(UserService);
  private readonly _toastService = inject(ToastMessageService);
  private readonly _translateService = inject(TranslateService);
  isLoading = signal(false);
  readonly passwordStrengthRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  hidePasswod = signal(true);
  constructor() {}
  signupForm = this._fb.nonNullable.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      password: [
        '',
        [Validators.required, Validators.pattern(this.passwordStrengthRegex)],
      ],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: passwordsMatchValidator('password', 'confirmPassword'),
    }
  );

  onSubmit() {
    const { confirmPassword, ...payload } = this.signupForm.getRawValue();
    payload.phoneNumber = `+880${payload.phoneNumber}`;
    this._userService
      .createUser(payload)
      .pipe(
        catchError((err) => of(false)),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe((res) => {
        if (!res) {
          this._toastService.showFailed(
            this._translateService.instant(
              ErrorMessageConst.SOMETHING_WENT_WRONG
            )
          );
        } else {
          this._toastService.showSuccess(
            this._translateService.instant(
              ErrorMessageConst.USER_CREATED_SUCCESSFULLY
            )
          );
          this._router.navigate(['login']);
        }
      });
  }

  allowOnlyDigit(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hidePasswod.set(!this.hidePasswod());
    event.preventDefault();
  }
  get form() {
    return this.signupForm.controls;
  }
}
