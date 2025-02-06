import { Component, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'dialog-form',
    imports:[MatDialogModule,MatFormFieldModule,FormsModule,MatInputModule],
    standalone:true,
    template: `
      <h2 mat-dialog-title class="text-lg font-semibold text-gray-900 dark:text-white">Reject reason</h2>

<form #form="ngForm" (ngSubmit)="onSubmit(form.value)" class="space-y-4">
    <mat-dialog-content class="p-4">
        <mat-form-field appearance="outline" class="w-full">
            <mat-label>Message</mat-label>
            <textarea matInput [(ngModel)]="data.message" name="message" required class="resize-none"></textarea>
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
  export class DialogFormComponent {
    constructor(
      public dialogRef: MatDialogRef<DialogFormComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    onSubmit(formData: any): void {
      this.dialogRef.close(formData);
    }
  }