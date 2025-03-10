import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { EmployeeRequestService } from 'app/modules/employee-request/employee-request-api.service';
import { SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo, SidePageRef, SidePageService } from 'ngx-side-page';
import { OvertimeService } from '../overtime.service';
import { AfterCloseSidePageService } from 'app/core/services/after-close-side-page.service';

@Component({
  selector: 'app-new-overtime',
  standalone: true,
  imports: [MatFormField,MatIcon,MatSelect,MatOption,MatInput,MatButton,MatLabel,ReactiveFormsModule,MatDatepickerModule,MatHint,MatNativeDateModule,
      MatInputModule,
      MatFormFieldModule,
      MatButtonModule,
      MatIconModule,
      NgIf,
      NgFor,
      DatePipe
  ],
  templateUrl: './new-overtime.component.html',
  styleUrl: './new-overtime.component.scss'
})
export class NewOvertimeComponent implements OnInit{
  overtimeForm:FormGroup;
  requestType:string
  overtimeList:any[]=[]
  project:any[]=[]
  updateData:any
      readonly data: SidePageInfo<NewOvertimeComponent> = inject(SIDE_PAGE_DATA);
      readonly refs: SidePageRef<NewOvertimeComponent> = inject(SIDE_PAGE_REF);

  constructor(private _formBuilder:FormBuilder,private _sidePageService:SidePageService,private api:EmployeeRequestService,private apiOvertime:OvertimeService,private reload:AfterCloseSidePageService){}
  ngOnInit(): void {
    this.overtimeForm=this._formBuilder.group({
      approval_type:[this.requestType,Validators.required],
      overtime_date:[null,Validators.required],
      overtime_duration:[null,Validators.required],
      task:[null,Validators.required],
      note:[null],
      overtime_type:[null,Validators.required],
      project_id:[null,Validators.required],
      day_type:[null,Validators.required],
    })
    this.perpareForm()
    this.apiOvertime.getProject().subscribe((response:any)=>{
      this.project=response.projects
      console.log(this.project) 
    })

    if(this.data.data){
      console.log(this.data.data)
      this.overtimeForm.get('approval_type').setValue('overtime')
      this.updateData=this.data.data
      this.overtimeForm.get('approval_type').disable()
      this.overtimeForm.get('overtime_type').setValue(this.data.data.overtime_type)
      this.overtimeForm.get('project_id').setValue(this.data.data.project_id)
      this.overtimeList=this.data.data.overtime_list
    }
  }
  perpareForm(){
  this.overtimeForm.get('overtime_type')?.valueChanges.subscribe(value=>{
    if(value==='project'){
      this.overtimeForm.get('project_id')?.enable()
    }
    else{
      this.overtimeForm.get('project_id')?.disable()
    }
  })
  }
  addToList(){
    const { approval_type,overtime_type,project_id, ...overtimeData } = this.overtimeForm.value;
    overtimeData.overtime_date = overtimeData.overtime_date.toISOString().split('T')[0];;

    this.overtimeList.push(overtimeData);
    this.overtimeForm.reset({
      approval_type: this.requestType,
      overtime_type:overtime_type,
      project_id:project_id
  });
  }
  changeRequestType(value){
      this.requestType=value
      this.overtimeForm.reset({
        approval_type: this.requestType
    });
    console.log(this.requestType)
    
  }

  deleteOvertime(index: number) {
    this.overtimeList.splice(index, 1);
  }

  submit(){
    console.log(this.overtimeList)
    if(this.overtimeList.length>0){
      let formData = this.overtimeForm.value;
      console.log(formData)
      let data = {
        "approval_type": formData.approval_type,
        "project_id": formData.project_id ?? null, // Ensuring it stays null if not provided
        "overtime_type": formData.overtime_type,
        "overtime_list":this.overtimeList
        }
      if(this.updateData){
        console.log("doen")
        this.api.updateEmployeeRequest(data,this.updateData.id).subscribe((response)=>{
          this.reload.setValue('overtime')
          this.refs.close()
        })
      }else{
      this.api.createEmployeeRequest(data).subscribe((response)=>{
        this.reload.setValue('overtime')
        this.refs.close()
      })
    }
    }
  }
}
