import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [MaterialModule, CommonModule, RouterModule],
})
export class LoginComponent {
  private readonly _fb = inject(FormBuilder);

  loginForm = this._fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get emailValue() {
    return this.loginForm.get('email')?.value;
  }

  onSubmit() {
    console.log(this.loginForm.controls.email.value);
  }
}
