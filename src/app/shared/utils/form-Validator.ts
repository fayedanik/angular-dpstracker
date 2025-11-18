import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(
  passwordKey = 'password',
  confirmPasswordKey = 'confirmPassword'
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey);
    const confirmPassword = group.get(confirmPasswordKey);

    if (!password || !confirmPassword) return null;

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordsMisMatch: true });
      return { passwordsMisMatch: true };
    } else {
      if (confirmPassword.errors) {
        const { passwordsMisMatch, ...rest } = confirmPassword.errors;
        confirmPassword.setErrors(Object.keys(rest).length ? rest : null);
      }
      return null;
    }
  };
}
