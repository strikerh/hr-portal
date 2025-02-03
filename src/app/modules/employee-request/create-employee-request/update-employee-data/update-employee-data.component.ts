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
  selector: 'app-update-employee-data',
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
  templateUrl: './update-employee-data.component.html',
  styleUrl: './update-employee-data.component.scss'
})
export class UpdateEmployeeDataComponent implements OnInit{
updateEmployeeData:FormGroup;
@Output() formSubmitted=new EventEmitter<any>();
constructor(private _formBuilder:FormBuilder){}
ngOnInit(): void {
  this.updateEmployeeData=this._formBuilder.group({
    name_of_data:['',Validators.required],
    old:['',Validators.required],
    new:['',Validators.required],
    file:['']
  })
}
submit(){
  if(this.updateEmployeeData.valid){
    this.formSubmitted.emit(this.updateEmployeeData.value)
  }
}
}
