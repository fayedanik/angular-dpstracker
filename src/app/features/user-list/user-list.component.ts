import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Inject,
  OnInit,
  PLATFORM_ID,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgxDatatableModule, TableColumn } from '@swimlane/ngx-datatable';
import { catchError, of } from 'rxjs';
import { User } from '../../core/domain-models/user.model';
import { UserService } from '../../core/services/user.service';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { Role } from '../../shared/consts/business.const';
import { ErrorMessageConst } from '../../shared/consts/errorMessage.const';
import { IGetUsersQuery } from '../../shared/interfaces/get-user-query.interface';
import { DialogRootService } from '../../shared/services/dialog-root.service';
import { ToastMessageService } from '../../shared/services/toast-message.service';

export interface IUserListResponse {
  users: User[];
}

@Component({
  selector: 'app-user-list',
  imports: [
    MatIconModule,
    NgxDatatableModule,
    CommonModule,
    TranslatePipe,
    MatChipsModule,
    MatButtonModule,
    MatPaginatorModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  @ViewChild('displayNameCellTemplate', { static: true })
  displayNameCellTemplate!: TemplateRef<any>;
  @ViewChild('emailCellTemplate', { static: true })
  emailCellTemplate!: TemplateRef<any>;
  @ViewChild('phoneNumberCellTemplate', { static: true })
  phoneNumberCellTemplate!: TemplateRef<any>;
  @ViewChild('createdAtCellTemplate', { static: true })
  createdAtCellTemplate!: TemplateRef<any>;
  @ViewChild('statusCellTemplate', { static: true })
  statusCellTemplate!: TemplateRef<any>;
  @ViewChild('actionCellTemplate', { static: true })
  actionCellTemplate!: TemplateRef<any>;

  private readonly _userService = inject(UserService);
  private readonly _dialogRootService = inject(DialogRootService);
  private readonly _translateService = inject(TranslateService);
  private readonly _toastService = inject(ToastMessageService);
  readonly role = Role;

  private readonly _usersQueryPayload = signal<IGetUsersQuery>({
    searchText: signal(''),
    pageIndex: 0,
    pageLimit: 10,
  });

  usersQueryPageLimit = computed(() => this._usersQueryPayload().pageLimit);
  userListResponse = this._userService.getAllUsers(this._usersQueryPayload);

  users = computed(() => {
    const users = this.userListResponse.hasValue()
      ? this.userListResponse.value().data?.users ?? []
      : [];
    return users;
  });

  totalCount = computed(() => {
    return this.userListResponse.hasValue()
      ? this.userListResponse.value().totalCount ?? 0
      : 0;
  });

  columns: TableColumn[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.initTable();
  }

  private initTable() {
    this.columns = [
      {
        name: 'Name',
        prop: 'displayName',
        sortable: false,
        width: 220,
        cellTemplate: this.displayNameCellTemplate,
      },
      {
        name: 'Email',
        prop: 'email',
        width: 220,
        sortable: false,
        cellTemplate: this.emailCellTemplate,
      },
      {
        name: 'Phone Number',
        prop: 'phoneNumber',
        sortable: false,
        cellTemplate: this.phoneNumberCellTemplate,
      },
      {
        name: 'Create Date',
        prop: 'createdAt',
        sortable: false,
        width: 200,
        cellTemplate: this.createdAtCellTemplate,
      },
      {
        name: 'Status',
        prop: 'isActive',
        sortable: false,
        cellTemplate: this.statusCellTemplate,
      },
      {
        name: 'Actions',
        prop: 'id',
        sortable: false,
        cellTemplate: this.actionCellTemplate,
        width: 250,
      },
    ];
  }

  sendInvitation(row: any) {
    const bodyText = this._translateService.instant(
      'ARE_YOU_SURE_WANT_TO_INVITE_THIS_USER'
    );
    this._dialogRootService
      .openDialog(ConfirmationModalComponent, {
        data: {
          bodyText: bodyText,
          icon: 'person_play',
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (!res) return;
        this._userService
          .activateUser(row)
          .pipe(catchError((err) => of(false)))
          .subscribe((res) => {
            if (!res) {
              this._toastService.showFailed(
                this._translateService.instant(
                  ErrorMessageConst.SOMETHING_WENT_WRONG
                )
              );
              return;
            }
            this._toastService.showSuccess(
              this._translateService.instant(
                ErrorMessageConst.ACCOUNT_ACTIVATED_SUCCESSFULLY
              )
            );
            this.userListResponse.reload();
          });
      });
  }

  hasTargetedRoles(roles: string[], target: string) {
    return roles.includes(target);
  }

  get isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  changePage(event: PageEvent) {
    this._usersQueryPayload.update((x) => ({
      ...x,
      pageIndex: event.pageIndex + 1,
    }));
  }
}
