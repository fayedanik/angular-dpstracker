import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Inject,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgxDatatableModule, TableColumn } from '@swimlane/ngx-datatable';
import { User } from '../../core/domain-models/user.model';
import { UserService } from '../../core/services/user.service';

export interface IUserListResponse {
  users: User[];
}

@Component({
  selector: 'app-user-list',
  imports: [MatIconModule, NgxDatatableModule, CommonModule],
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
  userList = this._userService.getAllUsers();
  rows = computed(() => {
    const users = this.userList.hasValue()
      ? this.userList.value().data?.users ?? []
      : [];
    return users;
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
        width: 200,
        cellTemplate: this.displayNameCellTemplate,
      },
      {
        name: 'Email',
        prop: 'email',
        width: 200,
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
      },
    ];
  }

  sendInvitation(row: any) {
    console.log(row);
  }

  get isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
  }
}
