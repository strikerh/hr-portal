import { NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { UploadComponent } from '../../upload/upload.component'
import { environment } from 'environments/environment';
import { EmployeeRequestService } from '../../employee-request-api.service';

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
                MatInput,
                NgForOf,
                NgFor,
                NgIf,
                UploadComponent
  ],
  templateUrl: './update-employee-data.component.html',
  styleUrl: './update-employee-data.component.scss'
})
export class UpdateEmployeeDataComponent implements OnInit{
updateEmployeeData:FormGroup;
updated_data = [];
@Output() formSubmitted=new EventEmitter<any>();
@Input() data:any;
documents:any
imageWantToDelete:any[]=[]
imageWantToUpload:any[]=[]
constructor(private _formBuilder:FormBuilder,private api:EmployeeRequestService){}
ngOnInit(): void {
  this.updateEmployeeData=this._formBuilder.group({
    field_name:['',Validators.required],
    old_data:['',Validators.required],
    new_data:['',Validators.required],
    documents:['']
  })
  if(this.data){
    console.log(this.data)
    this.updated_data=this.data.updated_data
    if(this.data.documents){
      this.documents=this.data.documents
     this.documents[0].url=environment.apiUrl+this.documents[0].url
    }
  }
}
submit(){
  let data;
  if(this.updated_data.length>0){
    data={updated_data:this.updated_data}
    if(this.updateEmployeeData.get('documents').value && !this.data){
      data={
        ...data,
        hasFile:true,
        documents:this.updateEmployeeData.get('documents').value
      }
    }
    if(this.data){
      if(this.imageWantToDelete){
        this.imageWantToDelete.forEach((image)=>{
          this.api.deleteAttchemnt(image).subscribe({
            next:(response)=>{

            }
          })
        })
      }
      if(this.imageWantToUpload){
        this.imageWantToUpload.forEach((image)=>{
          this.api.uploadAttchment(image,this.data.id).subscribe((response)=>{

          })
        })
      }
    }
    this.formSubmitted.emit(data)
  }
}

addRow(){
  if(this.updateEmployeeData.valid){

    this.updated_data.push(this.updateEmployeeData.value)
  }
  this.updateEmployeeData.patchValue({
    field_name: '',
    old_data: '',
    new_data: ''
  });
  }
deleteRow(index:number){
  this.updated_data.splice(index, 1);
}
handleFile(value){
  if(this.data){
    this.imageWantToUpload.push(value);
  }
this.updateEmployeeData.get('documents').setValue([value])
}
removeAttachment(id){
  delete this.documents[0]
this.imageWantToDelete.push(id);
}
}
