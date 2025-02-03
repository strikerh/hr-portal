import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { UploadComponent } from 'app/components/upload/upload.component';

@Component({
  selector: 'app-salary-slip',
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
            MatInput
  ],
  templateUrl: './salary-slip.component.html',
  styleUrl: './salary-slip.component.scss'
})
export class SalarySlipComponent implements OnInit{
  salarySlipForm:FormGroup;

  months = [
    "January",   // index 0 represents month 1
    "February",  // index 1 represents month 2
    "March",     // index 2 represents month 3
    "April",     // index 3 represents month 4
    "May",       // index 4 represents month 5
    "June",      // index 5 represents month 6
    "July",      // index 6 represents month 7
    "August",    // index 7 represents month 8
    "September", // index 8 represents month 9
    "October",   // index 9 represents month 10
    "November",  // index 10 represents month 11
    "December"   // index 11 represents month 12
  ];
  
  @Output() formSubmited =new EventEmitter<any>();
  constructor(private _formBuilder:FormBuilder){}
  ngOnInit(): void {
    this.salarySlipForm=this._formBuilder.group({
      Date:['January',Validators.required],
      ID:['',Validators.required],
      IBAN:['',Validators.required],
      PASS:['',Validators.required],
    })
  }
  submit(){
    if(this.salarySlipForm.valid){
    this.formSubmited.emit(this.salarySlipForm.value);
  }
  }
}
