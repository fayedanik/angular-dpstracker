import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
        canActivate: [authGuard],
        data: {
          isPublic: true,
        },
      },
      {
        path: 'registration',
        loadComponent: () =>
          import('./features/auth/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
        canActivate: [authGuard],
        data: {
          isPublic: true,
        },
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./features/transactions/transactions.component').then(
            (m) => m.TransactionsComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'members',
        loadComponent: () =>
          import('./features/user-list/user-list.component').then(
            (m) => m.UserListComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import(
            './features/bank-accounts/components/bank-account-list/bank-account-list.component'
          ).then((m) => m.BankAccountListComponent),
        canActivate: [authGuard],
      },
      {
        path: 'dps',
        loadComponent: () =>
          import('./features/dps/components/dps-list/dps-list.component').then(
            (m) => m.DpsListComponent
          ),
        canActivate: [authGuard],
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
