import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { UploadComponent } from 'app/components/upload/upload.component';

@Component({
  selector: 'app-define-job',
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
                MatInput,
                MatDatepicker
  ],
  templateUrl: './define-job.component.html',
  styleUrl: './define-job.component.scss'
})
export class DefineJobComponent implements OnInit {
  defineJobForm: FormGroup;
  @Output() formSubmitted=new EventEmitter<any>();
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
   this.defineJobForm=this._formBuilder.group({
    date:['',Validators.required],
    position:['',Validators.required],
    description:['',Validators.required],
   }) 
  }
  submit(){
    if(this.defineJobForm.valid){
      this.formSubmitted.emit(this.defineJobForm.value)
    }
  }

}
