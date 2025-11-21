import { CommonModule } from '@angular/common';
import { Component, inject, Optional } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { PlatformDetectorService } from '../../../../shared/services/platform-detector.service';
@Component({
  selector: 'app-terms-and-conditions',
  imports: [
    CommonModule,
    TranslatePipe,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss',
})
export class TermsAndConditionsComponent {
  constructor(
    @Optional()
    private readonly _dialogRef: MatDialogRef<TermsAndConditionsComponent>,
    @Optional()
    private readonly _bottomSheetRef: MatBottomSheetRef<TermsAndConditionsComponent>
  ) {}
  private readonly _platformDetectorService = inject(PlatformDetectorService);

  sections = [
    {
      title: 'CONSTITUTION.SECTION1_TITLE',
      body: [
        'CONSTITUTION.S1.LINE1',
        'CONSTITUTION.S1.LINE2',
        'CONSTITUTION.S1.LINE3',
      ],
    },
    {
      title: 'CONSTITUTION.SECTION2_TITLE',
      body: [
        'CONSTITUTION.S2.LINE1',
        'CONSTITUTION.S2.LINE2',
        'CONSTITUTION.S2.LINE3',
      ],
    },
    {
      title: 'CONSTITUTION.SECTION3_TITLE',
      body: [
        'CONSTITUTION.S3.LINE1',
        'CONSTITUTION.S3.LINE2',
        'CONSTITUTION.S3.LINE3',
      ],
    },
    {
      title: 'CONSTITUTION.SECTION4_TITLE',
      body: ['CONSTITUTION.S4.LINE1', 'CONSTITUTION.S4.LINE2'],
    },
    {
      title: 'CONSTITUTION.SECTION5_TITLE',
      body: ['CONSTITUTION.S5.LINE1', 'CONSTITUTION.S5.LINE2'],
    },
    {
      title: 'CONSTITUTION.SECTION6_TITLE',
      body: [
        'CONSTITUTION.S6.LINE1',
        'CONSTITUTION.S6.LINE2',
        'CONSTITUTION.S6.LINE3',
        'CONSTITUTION.S6.LINE4',
      ],
    },
    {
      title: 'CONSTITUTION.SECTION7_TITLE',
      body: ['CONSTITUTION.S7.LINE1', 'CONSTITUTION.S7.LINE2'],
    },
    { title: 'CONSTITUTION.SECTION8_TITLE', body: ['CONSTITUTION.S8.LINE1'] },
  ];

  bnSections = [
    {
      title: 'BN.SECTION1_TITLE',
      body: ['BN.S1.LINE1', 'BN.S1.LINE2', 'BN.S1.LINE3'],
    },
    {
      title: 'BN.SECTION2_TITLE',
      body: ['BN.S2.LINE1', 'BN.S2.LINE2', 'BN.S2.LINE3'],
    },
    {
      title: 'BN.SECTION3_TITLE',
      body: ['BN.S3.LINE1', 'BN.S3.LINE2', 'BN.S3.LINE3'],
    },
    { title: 'BN.SECTION4_TITLE', body: ['BN.S4.LINE1', 'BN.S4.LINE2'] },
    { title: 'BN.SECTION5_TITLE', body: ['BN.S5.LINE1', 'BN.S5.LINE2'] },
    {
      title: 'BN.SECTION6_TITLE',
      body: ['BN.S6.LINE1', 'BN.S6.LINE2', 'BN.S6.LINE3', 'BN.S6.LINE4'],
    },
    { title: 'BN.SECTION7_TITLE', body: ['BN.S7.LINE1', 'BN.S7.LINE2'] },
    { title: 'BN.SECTION8_TITLE', body: ['BN.S8.LINE1'] },
  ];

  get isPlatformMobile() {
    return this._platformDetectorService.isPlaformMobile;
  }

  close(success: boolean = false) {
    if (this._dialogRef) this._dialogRef.close(success);
    else if (this._bottomSheetRef) this._bottomSheetRef.dismiss(success);
  }
}
