import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    { short: "jan", full: "January" },
    { short: "feb", full: "February" },
    { short: "mar", full: "March" },
    { short: "apr", full: "April" },
    { short: "may", full: "May" },
    { short: "jun", full: "June" },
    { short: "jul", full: "July" },
    { short: "aug", full: "August" },
    { short: "sep", full: "September" },
    { short: "oct", full: "October" },
    { short: "nov", full: "November" },
    { short: "dec", full: "December" }
  ];
  
  
  @Output() formSubmited =new EventEmitter<any>();
  @Input() data:any;
  constructor(private _formBuilder:FormBuilder){}
  ngOnInit(): void {
    this.salarySlipForm=this._formBuilder.group({
      requested_salary_date:['January',Validators.required],
      id_no:['',Validators.required],
      iban_no:['',Validators.required],
      pass_no:['',Validators.required],
    })
    
    if(this.data){
      this.salarySlipForm.get('requested_salary_date').setValue(this.data.requested_salary_date);
      this.salarySlipForm.get('id_no').setValue(this.data.id_no);
      this.salarySlipForm.get('iban_no').setValue(this.data.iban_no);
      this.salarySlipForm.get('pass_no').setValue(this.data.pass_no);
    }
  }
  submit(){
    if(this.salarySlipForm.valid){
    this.formSubmited.emit(this.salarySlipForm.value);
  }
  }
}
