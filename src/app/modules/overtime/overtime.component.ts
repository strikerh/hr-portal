import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SidePageService } from 'ngx-side-page';
import { NewOvertimeComponent } from './new-overtime/new-overtime.component';
import { MatTableModule } from '@angular/material/table';
import { DatePipe, NgIf } from '@angular/common';
import { OvertimeService } from './overtime.service';
import { DialogFormComponent } from '../employee-request/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ViewRequestService } from './view-request.service';
import { ViewOvertimeComponent } from "./view-overtime/view-overtime.component";
import { AfterCloseSidePageService } from 'app/core/services/after-close-side-page.service';

@Component({
  selector: 'app-overtime',
  standalone: true,
  imports: [MatIcon, MatButton, MatTableModule, NgIf, ViewOvertimeComponent,DatePipe],
  templateUrl: './overtime.component.html',
  styleUrl: './overtime.component.scss'
})
export class OvertimeComponent implements OnInit{
  tabIndex:'my'|'team'='my'
  displayedColumns1: string[] = [
    'id',
    'Sequence',
    'date',
    'type',
    'status',
    'Note',
    'action'
];
employeeRequest:any[]=[]
requestsNeedapproves:any[]=[] 
isOpenView:boolean=false;
selectedRequest:any
showAlert(message) {
  this.snackBar.open(message, 'Close', {
    duration: 3000, // Auto close after 3 seconds
    verticalPosition: 'top', // 'top' or 'bottom'
    horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right'
    panelClass: ['custom-snackbar'], // Add custom CSS class if needed
  });
}
constructor(private _sidePageSerivce:SidePageService,private view:ViewRequestService,private api:OvertimeService,private dialog: MatDialog,private snackBar: MatSnackBar,private reload:AfterCloseSidePageService){}
ngOnInit(): void {
  this.getEmployeeRequest()
  this.getRequestNeedApproves()
  this.reload.getValue().subscribe((value)=>{
    console.log(value)
    if(value){
      this.getEmployeeRequest()
      this.getRequestNeedApproves()
    }
  })
}
getEmployeeRequest(){
this.api.getEmployeeRequest().subscribe({
  next:(response:any)=>{
    this.employeeRequest=response.emp_request
  }
})
}

getRequestNeedApproves(){  
this.api.getRequestNeedApproves().subscribe({
  next:(response:any)=>{
    this.requestsNeedapproves=response.requests
  }})

  this.view.isOpen$.subscribe((value)=>{
    this.isOpenView=value})

}
 async updateInfo(value){
      let data={
        ...value
      }
console.log(data)    

      const ref = this._sidePageSerivce.openSidePage('create-employee-request', NewOvertimeComponent, {
        width: '40%',
        maxWidth: '600px',
        data:data
      });
      
      ref.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
        this.getEmployeeRequest()

    });

    }

 updateRequestStatus(action:string,id:string){
      if(action==='rejected'){
        const dialogRef = this.dialog.open(DialogFormComponent, {
          width: '400px',
          data: {message: ''}, // Pass initial data if needed
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            let data={
              request_status:action,
              reject_reason:result.message
            }
            this.api.updateRequestStatus(data,id).subscribe({
              next:(response)=>{
               this.showAlert("Request "+action)
               this.getEmployeeRequest()
               this.getRequestNeedApproves()
              }
            })
          } else {
            console.log('Dialog closed without form submission');
          }
        });
    
      }
      else{
      let data={
        request_status:action,
      }
      this.api.updateRequestStatus(data,id).subscribe({
        next:(response)=>{
          this.showAlert("Request "+action)
          this.getEmployeeRequest()
          this.getRequestNeedApproves()

        }
      })
    }
  }

  requestOvertime(){
    let ref=this._sidePageSerivce.openSidePage('overtime',NewOvertimeComponent,{
      width:'60%',
      maxWidth:'800px'
    })
    ref.afterClosed().subscribe((value)=>{
      console.log("ezz")
    })
  }

  openView(value){
this.selectedRequest=value;
this.view.setOpen(true);
  }
  getStatus(value){
    if(value=='hr_review'){
      return 'HR Review'
    }
    else if(value == 'direct_manager'){
      return 'Direct Manager'
    }
    else{
      return value
    }
            }
}
