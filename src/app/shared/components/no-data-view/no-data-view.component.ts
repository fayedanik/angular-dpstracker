import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-no-data-view',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './no-data-view.component.html',
  styleUrl: './no-data-view.component.scss',
})
export class NoDataViewComponent {
  title = input('NO_DATA_FOUND');
  message = input('YOU_HAVE_NOT_CREATED_ANY_ITEM');
}
