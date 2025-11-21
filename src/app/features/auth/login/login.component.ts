import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { MaterialModule } from '../../../shared/modules/material.module';
import { ToastMessageService } from '../../../shared/services/toast-message.service';
import { ISigninPayload } from './interfaces/auth-payload.interface';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    TranslatePipe,
    MatProgressBarModule,
  ],
  providers: [],
})
export class LoginComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _translate = inject(TranslateService);
  private readonly _toastMessageService = inject(ToastMessageService);
  isLoading = signal(false);
  loginForm = this._fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  get emailValue() {
    return this.loginForm.get('email')?.value;
  }

  onSubmit() {
    const payload = { ...this.loginForm.value } as ISigninPayload;
    this.isLoading.set(true);
    this._authService
      .login(payload)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe((res) => {
        const message = this._translate.instant(res.message);
        if (res.success) {
          this._toastMessageService.showSuccess(message);
          this._router.navigateByUrl('dashboard');
        } else {
          this._toastMessageService.showFailed(message);
        }
      });
  }
}
