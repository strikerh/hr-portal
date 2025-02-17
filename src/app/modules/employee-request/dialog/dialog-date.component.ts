import { Component, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'dialog-form',
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule
    ],
    standalone: true,
    template: `
      <h2 mat-dialog-title class="text-lg font-semibold text-gray-900 dark:text-white">Select Date</h2>

      <form #form="ngForm" (ngSubmit)="onSubmit(form.value)" class="space-y-4">
          <mat-dialog-content class="p-4">
              <mat-form-field class="w-full">
                  <mat-label>Acutal last date</mat-label>
                  <input matInput [matDatepicker]="picker" [(ngModel)]="data.selectedDate" name="selectedDate" required>
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
          </mat-dialog-content>

          <mat-dialog-actions class="flex justify-end gap-2 p-4">
              <button type="button" mat-button (click)="onNoClick()" class="text-gray-600 hover:text-gray-900">
                  Cancel
              </button>
              <button mat-flat-button color="primary" type="submit" [disabled]="!form.valid">
                  Submit
              </button>
          </mat-dialog-actions>
      </form>
    `,
})
export class DialogDateFormComponent {
    constructor(
      public dialogRef: MatDialogRef<DialogDateFormComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

    onSubmit(formData: any): void {
      // Ensure only the date part is saved
      if (formData.selectedDate) {
        formData.selectedDate = new Date(formData.selectedDate).toISOString().split('T')[0]; // YYYY-MM-DD format
      }
      this.dialogRef.close(formData);
    }
}
