import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-no-data-view',
  imports: [MatIconModule],
  templateUrl: './no-data-view.component.html',
  styleUrl: './no-data-view.component.scss',
})
export class NoDataViewComponent {
  title = input('No data found');
  message = input("You haven't created any item yet");
}
