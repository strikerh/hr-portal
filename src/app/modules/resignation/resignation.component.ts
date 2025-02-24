import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SidePageService } from 'ngx-side-page';
import { NewResignationComponent } from './new-resignation/new-resignation.component';
import { MatTableModule } from '@angular/material/table';
import { DatePipe, NgIf } from '@angular/common';
import { resignationApiService } from './resignation-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogFormComponent } from '../employee-request/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogDateFormComponent } from '../employee-request/dialog/dialog-date.component';
import { ViewRequestService } from './view-request.service';
import { ViewResignationComponent } from "./view-resignation/view-resignation.component";
import { AfterCloseSidePageService } from 'app/core/services/after-close-side-page.service';

@Component({
  selector: 'app-resignation',
  standalone: true,
  imports: [MatIcon, MatButtonModule, MatTableModule, NgIf, DatePipe, ViewResignationComponent],
  templateUrl: './resignation.component.html',
  styleUrl: './resignation.component.scss'
})
export class ResignationComponent implements OnInit{

  
  employeeRequest:any[]=[]
  requestNeedApproves:any[]=[]
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
  isOpenView:boolean=false;
  selectedRequest:any
  constructor(private _sidePageService:SidePageService,private api:resignationApiService,private snackBar:MatSnackBar,private dialog: MatDialog,private view:ViewRequestService,private reload:AfterCloseSidePageService) { }

  showAlert(message) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Auto close after 3 seconds
      verticalPosition: 'top', // 'top' or 'bottom'
      horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right'
      panelClass: ['custom-snackbar'], // Add custom CSS class if needed
    });
  }

  ngOnInit(): void {
    this.reload.getValue().subscribe((value)=>{
      console.log(value)
      if(value){
        this.getEmployeeRequest()
        this.getRequestNeedApproves()
      }
    })
    this.getEmployeeRequest()
    this.getRequestNeedApproves()
this.view.isOpen$.subscribe((value)=>{
  this.isOpenView=value
})
  }
  i=0;
  requestResignation(){
    this.i++;
    console.log(this.i)
   let ref = this._sidePageService.openSidePage('resignation-request'+this.i,NewResignationComponent,{
      width:'40%',
      maxWidth:'600px'
    });

    ref.afterClosed().subscribe((data)=>{
      console.log('ezz')
    })
  }
  getEmployeeRequest(){
this.api.getEmployeeRequests().subscribe((data:any)=>{  
  this.employeeRequest=data.emp_request
})
  }

  getRequestNeedApproves(){
    this.api.getRequestNeedApproves().subscribe((data:any)=>{
      this.requestNeedApproves=data.requests
      console.log(this.requestNeedApproves)
    })
  }
   updateRequestStatus(action:string,id:string,status:string){

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
        else if(action==='approved'){
          if(status=='department_manager' || status==='project_manager'){
            let data={
              request_status:action,
            }
            console.log(id)

            this.api.updateRequestStatus(data,id).subscribe({
              next:(response)=>{
               this.showAlert("Request "+action)
               this.getEmployeeRequest()
               this.getRequestNeedApproves()
              }
            })
          }
          else{
          const dialogRef = this.dialog.open(DialogDateFormComponent, {
            width: '400px',
            data: {message: ''}, // Pass initial data if needed
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              let data={
                request_status:action,
                actual_last_date:result.selectedDate
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
      
        }}
        else{
        let data={
          request_status:action,
        }
        this.api.updateRequestStatus(data,id).subscribe({
          next:(response)=>{
            this.showAlert("Request "+action)
            this.getEmployeeRequest()
            // this.getRequestNeedApproves()
  
          }
        })
      }
    }
    openView(value){
      this.view.setOpen(true) ;
      this.selectedRequest=value
    }
     async updateInfo(value){
          let data={
            ...value
          }
            const response: any = await this.api.getAttchemnt(value.id).toPromise(); // Convert Observable to Promise
            if (response.attachments) {
              data = { ...data, documents: response.attachments };
            }
    console.log(data)    
    
          const ref = this._sidePageService.openSidePage('create-employee-request', NewResignationComponent, {
            width: '40%',
            maxWidth: '600px',
            data:data
          });
          
          ref.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            this.getEmployeeRequest()
    
        });
    
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
