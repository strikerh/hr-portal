import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { UploadComponent } from "../../../components/upload/upload.component";
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { NgFor, NgIf } from '@angular/common';
import { EmployeeRequestService } from 'app/modules/employee-request/employee-request-api.service';
import { forEach } from 'lodash';
import { SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo, SidePageRef } from 'ngx-side-page';
import { CreateEmployeeRequestComponent } from 'app/modules/employee-request/create-employee-request/create-employee-request.component';
import { AfterCloseSidePageService } from 'app/core/services/after-close-side-page.service';

@Component({
  selector: 'app-new-insurance',
  standalone: true,
  imports: [MatFormField, MatSelect, MatOption, MatLabel, MatHint, ReactiveFormsModule, MatInputModule, UploadComponent,MatButtonModule,MatTableModule,NgIf,NgFor],
  templateUrl: './new-insurance.component.html',
  styleUrl: './new-insurance.component.scss'
})
export class NewInsuranceComponent implements OnInit {
insureacneForm:FormGroup;
selecteForm:string
familyChangeList: any[] = [];
oldData:any
readonly data: SidePageInfo<CreateEmployeeRequestComponent> = inject(SIDE_PAGE_DATA);
readonly refs: SidePageRef<CreateEmployeeRequestComponent> = inject(SIDE_PAGE_REF);

constructor(private _formBuilder:FormBuilder,private api:EmployeeRequestService,private reload:AfterCloseSidePageService){} 
ngOnInit(): void {
this.insureacneForm=this._formBuilder.group({
  approval_type:[null,Validators.required],
  for_whom:[null,Validators.required ],
  family_member_name:[null,Validators.required],
  old_type:[null,Validators.required],
  new_type:[null,Validators.required],
  relative_type:[null,Validators.required],
  relative:[null,Validators.required],
  file:[null],
  member_name:[null,Validators.required],
  description:[null],
})
this.prepareForm();

if(this.data.data){
  this.oldData=this.data.data
  this.selecteForm=this.oldData.approval_type;
  this.insureacneForm.get('approval_type').setValue(this.selecteForm)
  console.log(this.selecteForm)
  // this.requestForm.get('requestType').setValue('Business Card')
  }

}


prepareForm(){

  this.insureacneForm.get('approval_type')?.valueChanges.subscribe(value => {
    if (value === 'add_new_insurance' || value === 'delete_insurance') {
      this.insureacneForm.get('new_type')?.disable();
      this.insureacneForm.get('old_type')?.disable();
      this.insureacneForm.get('member_name')?.enable();
    } else {
      this.insureacneForm.get('new_type')?.enable();
      this.insureacneForm.get('old_type')?.enable();
      this.insureacneForm.get('member_name')?.disable();
    }
  });
  this.insureacneForm.get('for_whom')?.valueChanges.subscribe(value => {
    if (value === 'family' && this.insureacneForm.get('approval_type')?.value === 'update_insurance_type') {
      this.insureacneForm.get('family_member_name')?.enable();
      this.insureacneForm.get('relative_type')?.disable()
    } else if(value === 'family' && this.insureacneForm.get('approval_type')?.value != 'update_insurance_type') {
      this.insureacneForm.get('family_member_name')?.disable();
      this.insureacneForm.get('relative_type')?.enable()
    }
    else{
      this.insureacneForm.get('family_member_name')?.disable();
      this.insureacneForm.get('relative_type')?.disable()
    }
  });
this.insureacneForm.get('relative_type')?.valueChanges.subscribe(value=>{
  if(value==='other'){
    this.insureacneForm.get('relative')?.enable()
  }
  else{
    this.insureacneForm.get('relative')?.disable()
  }
})
}


changeRequestType(value){
this.selecteForm=value
this.insureacneForm.reset({
approval_type: this.selecteForm
});
this.familyChangeList=[]
}


addFamilyMember(){
this.familyChangeList.push({
  family_member_name:this.insureacneForm.get('family_member_name')?.value,
  old_type:this.insureacneForm.get('old_type')?.value,
  new_type:this.insureacneForm.get('new_type')?.value
})
this.insureacneForm.get('family_member_name')?.reset();
this.insureacneForm.get('old_type')?.reset();
this.insureacneForm.get('new_type')?.reset();
console.log(this.familyChangeList)
}

deleteRow(item: any) {
  this.familyChangeList = this.familyChangeList.filter(data => data !== item);
}


submit(){
  if(this.insureacneForm.get('approval_type')?.value==='update_insurance_type' && this.insureacneForm.get('for_whom')?.value==='family'){
  if(this.familyChangeList.length>0){
    let data={
      "approval_type":this.insureacneForm.get('approval_type')?.value,
      "for_whom":this.insureacneForm.get('for_whom')?.value,
      "change_family_list":this.familyChangeList,
      "description":this.insureacneForm.get('description')?.value
    }
    let files=this.insureacneForm.get('file').value

    this.api.createEmployeeRequest(data).subscribe({
      next: (response:any) => {
        if(files){
          forEach(files,(file)=>{
          this.api.uploadAttchment(file,response.employee_request['id']).subscribe({
            next: (response) => {
              console.log(response);
            },
            error: (error) => {
              console.log(error);
            },  
          })
        })
        }
      },
      error: (error) => {
        console.log(error);
      },  
    })
  }
  }

  else if(this.insureacneForm.valid){
let data=this.insureacneForm.value
let files=this.insureacneForm.get('file').value
console.log(this.insureacneForm.get('file').value)
this.api.createEmployeeRequest(data).subscribe({
  next: (response:any) => {
    if(files){
      forEach(files,(file)=>{
      this.api.uploadAttchment(file,response.employee_request['id']).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },  
      })
    })
    }
    this.reload.setValue(true)
  },
  error: (error) => {
    console.log(error);
  },  
})

}
}

}
