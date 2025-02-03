import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SalaryClearanceFormComponent } from '../salary-clearance/salary-clearance-form.component';
import { SalarySlipComponent } from '../salary-slip/salary-slip.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-business-card-form',
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
        SalaryClearanceFormComponent,
        SalarySlipComponent,
        BusinessCardFormComponent,
        MatInput,
        NgIf
  ],
  templateUrl: './business-card-form.component.html',
  styleUrl: './business-card-form.component.scss'
})
export class BusinessCardFormComponent implements OnInit {
  businessCardForm:FormGroup;
  @Output() formSubmited=new EventEmitter<any>();
  constructor(private _formBuilder:FormBuilder){}
  ngOnInit(): void {
    this.businessCardForm=this._formBuilder.group({
      en_name:['',Validators.required],
      ar_name:['',Validators.required],
      mobile:['',Validators.required],
      job_position:['',Validators.required],
      other_details:['',Validators.required]
    })
  }
  submit(){
    if(this.businessCardForm.valid){
    this.formSubmited.emit(this.businessCardForm.value)
    }
  }
}
