import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo, SidePageRef } from 'ngx-side-page';
import { EmployeeRequestService } from '../employee-request-api.service';
import { SalaryClearanceFormComponent } from './salary-clearance/salary-clearance-form.component';
import { SalarySlipComponent } from './salary-slip/salary-slip.component';
import { BusinessCardFormComponent } from "./business-card/business-card-form.component";
import { DefineJobComponent } from "./define-job/define-job.component";
import { UpdateEmployeeDataComponent } from './update-employee-data/update-employee-data.component';
import { AfterCloseSidePageService } from 'app/core/services/after-close-side-page.service';

@Component({
  selector: 'app-create-employee-request',
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
    DefineJobComponent,
    UpdateEmployeeDataComponent
],  
  templateUrl: './create-employee-request.component.html',
  styleUrl: './create-employee-request.component.scss'
})
export class CreateEmployeeRequestComponent implements OnInit {
    readonly data: SidePageInfo<CreateEmployeeRequestComponent> = inject(SIDE_PAGE_DATA);
    readonly refs: SidePageRef<CreateEmployeeRequestComponent> = inject(SIDE_PAGE_REF);
    requestForm:FormGroup;
    requestTypes: { name: string,key:string }[] = [];
    selectedRequest=null
    oldData:any;
    // oldData:any;
  constructor(private form: FormBuilder,private api:EmployeeRequestService,private reload:AfterCloseSidePageService) { }
  ngOnInit(): void {
 
    this.requestForm = this.form.group({
      requestType: [this.selectedRequest],
    })


    this.api.getRequestLookup().subscribe({
      next:(response:any)=>{
        console.log(response)
        this.requestTypes =response.request_types

        },
      error:(error)=>{

      }
    })

    if(this.data.data){
      this.oldData=this.data.data
      this.selectedRequest=this.oldData.approval_type;
      this.requestForm.get('requestType').setValue(this.selectedRequest)
      console.log(this.selectedRequest)
      
      // this.requestForm.get('requestType').setValue('Business Card')
      this.requestForm.get('requestType').disable()
      }
  }

  changeRequestType(value):void{
  this.selectedRequest=value
  }

entityValidator(control: AbstractControl) {
    const entityType = this.requestForm?.get('entityType')?.value;
    if (entityType === 'specific' && !control.value) {
      return { required: true };
    }
    return null;
  }


  handleFormSubmission(value){
    const { documents, ...filteredData } = value;
    console.log(documents)
    console.log(filteredData)

let data={
  ...filteredData,
  approval_type:this.requestTypes.find((m)=>m.name===this.selectedRequest).key
}
if(this.oldData){
  this.api.updateEmployeeRequest(data,this.oldData.id).subscribe({
    next:(response)=>{    
      this.refs.close()
    }
  })
  return
}
console.log(filteredData)

let files=[]
if(data.hasFile){
  documents.forEach((doc)=>{
    files.push(doc);
  })
}

this.api.createEmployeeRequest(data).subscribe({
  next:(response:any)=>{
    if(files.length>0){
      files.forEach((doc)=>{
        let file=doc.file? doc.file:doc
        this.api.uploadAttchment(file, response.employee_request.id).subscribe({
          next: () => {
            console.log('File uploaded successfully');
          },
          error: (err) => {
            console.error('File upload failed:', err);
          },
        });
      })
    }
    console.log(response)
    this.refs.close()
    this.reload.setValue('employee')
  }
})
  
}
    
}
