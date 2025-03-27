import { Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  isOpen: boolean = true;
  dialogType: DialogType;
  message: string;
  title: string;
  buttonText: string;
  buttonAction: boolean
  extraButton: boolean;
  extraButtonText: string;
  extraButtonAction: boolean

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogType = data.dialogType;
    this.message = data.message;
    this.title = data.title;
    this.buttonText = data.buttonText || 'Close';
    this.buttonAction = data.buttonAction || false
    this.extraButton = data.extraButton
    this.extraButtonText = data.extraButtonText
    this.extraButtonAction = data.extraButtonAction || true
  }

  getDialogHeader() {
    switch (this.dialogType) {
      case DialogType.SUCCESS:
        return {emoji: '✅ ', text: 'Success'};
      case DialogType.ERROR:
        return {emoji: '❌ ', text: 'Error'};
      case DialogType.WARNING:
        return {emoji: '⚠️ ', text: 'Warning'};
      case DialogType.CUSTOM:
        return {emoji: '', text: this.title};
    }
  }
}

export enum DialogType {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  WARNING = "WARNING",
  CUSTOM = "CUSTOM"
}
