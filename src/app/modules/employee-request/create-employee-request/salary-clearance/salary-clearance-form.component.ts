import { NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { UploadComponent } from 'app/components/upload/upload.component';

@Component({
  selector: 'app-salary-clearance-form',
  standalone: true,
  imports: [
      MatFormFieldModule, // Use MatFormFieldModule instead of MatFormField
        ReactiveFormsModule,
        MatLabel, // Correct
        MatSelectModule, // Correct
        MatInputModule, // Required for input fields inside mat-form-field
        MatOptionModule, // Required for mat-option inside mat-select
        MatButtonModule, // Optional, but useful for buttons
        MatDatepickerModule, // Optional, if you use date pickers
        MatNativeDateModule,
        MatRadioModule,
        UploadComponent,
        NgIf
  ],
  templateUrl: './salary-clearance-form.component.html',
  styleUrl: './salary-clearance-form.component.scss'
})
export class SalaryClearanceFormComponent implements OnInit {
    salaryClearanceForm:FormGroup;
    @Output() formSubmitted = new EventEmitter<any>();

    constructor(private form: FormBuilder) { }
  ngOnInit(): void {
    this.salaryClearanceForm = this.form.group({
      chamber_of_commerce: [false, Validators.required],
      language: ['ar', Validators.required],
      entityType: ['whom', Validators.required],
      entity: ['', this.entityValidator.bind(this)],
      salary_summarized: ['detailed', Validators.required],
      addressed_to_bank: [false, Validators.required],
      IBAN_certificate: [null, this.bankValidator.bind(this)],
      national_residence: [null, this.bankValidator.bind(this)],
      passport: [null, this.bankValidator.bind(this)]
    })
  }

  bankValidator(control: AbstractControl) {
    const addressedToBank = control.root.get('addressed_to_bank')?.value;
    if (addressedToBank===true && !control.value) {
      return { required: true };
    }
    return null;
  }

  isFileUploaded(controlName: string): boolean {
    const value = this.salaryClearanceForm.get(controlName)?.value;
    return value && value.length > 0; // Ensures it's an array with at least one file
  }
  
  entityValidator(control: AbstractControl) {
    const entityType = this.salaryClearanceForm?.get('entityType')?.value;
    if (entityType === 'specific' && !control.value) {
      return { required: true };
    }
    return null;
  }
  submitForm(){
    if (this.salaryClearanceForm.valid) {
      this.formSubmitted.emit(this.salaryClearanceForm.value);
    }
  }
}
