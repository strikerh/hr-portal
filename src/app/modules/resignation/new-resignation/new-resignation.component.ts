import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatRipple } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { AfterCloseSidePageService } from 'app/core/services/after-close-side-page.service';
import { EmployeeRequestService } from 'app/modules/employee-request/employee-request-api.service';
import { SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo, SidePageRef } from 'ngx-side-page';

@Component({
  selector: 'app-new-resignation',
  standalone: true,
  imports: [MatFormField,MatSelect,MatButtonModule,MatOption,MatInput,MatLabel,MatHint,MatDatepickerModule,ReactiveFormsModule,
    MatDatepickerToggle,
        MatDatepicker,
        MatIconModule,
        MatNativeDateModule,
        MatInputModule,
        MatFormFieldModule,

  ],
  templateUrl: './new-resignation.component.html',
  styleUrl: './new-resignation.component.scss'
})
export class NewResignationComponent implements OnInit{
resignationForm:FormGroup
selectedType:string
  updateData:any
      readonly data: SidePageInfo<NewResignationComponent> = inject(SIDE_PAGE_DATA);
      readonly refs: SidePageRef<NewResignationComponent> = inject(SIDE_PAGE_REF);

constructor(private _formBuilder:FormBuilder,private api:EmployeeRequestService,private reload:AfterCloseSidePageService){}
ngOnInit(): void {
  this.resignationForm=this._formBuilder.group({
    approval_type:[this.selectedType,Validators.required],
    resignation_type:[null,Validators.required],
    resignation_reason:[null,Validators.required],
    last_date:[null,Validators.required],
    termination_reason:[null,Validators.required],
    other_reason:[null,Validators.required],
})
this.prepareForm()

if(this.data.data){
  this.resignationForm.get('approval_type').setValue('resignation')
  this.resignationForm.get('approval_type').disable()

  this.resignationForm.get('resignation_type').disable()
  this.updateData=this.data.data
  this.resignationForm.get('resignation_type').setValue(
    this.updateData.resignation_type.includes('Resignation') ? 'resignation' : 'termination_of_contract'
  );
    this.resignationForm.get('resignation_reason').setValue(this.updateData.resignation_reason)
  this.resignationForm.get('last_date').setValue(this.updateData.last_date)
  this.resignationForm.get('termination_reason').setValue(this.updateData.termination_reason)
  this.resignationForm.get('other_reason').setValue(this.updateData.other_reason)
}
}
prepareForm(){
  this.resignationForm.get('other_reason')?.disable();
  this.resignationForm.get('resignation_type')?.valueChanges.subscribe(value => {
    if(value === 'resignation'){
      this.resignationForm.get('resignation_reason')?.enable();
      this.resignationForm.get('termination_reason')?.disable();
      this.resignationForm.get('last_date')?.enable();
    }
    else{
      this.resignationForm.get('resignation_reason')?.disable();
      this.resignationForm.get('termination_reason')?.enable();
      this.resignationForm.get('last_date')?.disable();

    }
  })
  this.resignationForm.get('termination_reason')?.valueChanges.subscribe(value => {
    if(value === 'other'){
      this.resignationForm.get('other_reason')?.enable();
    }
    else{
      this.resignationForm.get('other_reason')?.disable();
    }
  })
}
changeRequestType(value){
  this.selectedType=value
  this.resignationForm.reset({
    approval_type: this.selectedType
  });
}
submit(){
  if(this.resignationForm.valid){
    let date: Date | null = this.resignationForm.value.last_date;
    let data=this.resignationForm.value;
    console.log(data)
  if (date) {
    if(typeof date!='string'){
      const formattedDate = date.toISOString().split('T')[0]; // "2025-02-03"
      data.last_date=formattedDate
    }
    console.log(data)
  }
  if(this.updateData){
    let dataToUpdlod={
      'approval_type':this.resignationForm.get('approval_type').value,
      "resignation_type":this.resignationForm.get('resignation_type').value,
      ...data
      
    }
    this.api.updateEmployeeRequest(dataToUpdlod,this.data.data['id']).subscribe((response)=>{
      this.reload.setValue(true)
      console.log(response)
      this.refs.close()
    })
  }
  else{

  
    this.api.createEmployeeRequest(data).subscribe((response)=>{
      this.reload.setValue(true)

      console.log(response)
      this.refs.close()
    })
  }
}
}
}
