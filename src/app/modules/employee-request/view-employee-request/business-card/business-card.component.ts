import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewRequestService } from '../../view-request.service';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeRequestService } from '../../employee-request-api.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from '../../dialog/dialog.component';
import { CreateEmployeeRequestComponent } from '../../create-employee-request/create-employee-request.component';
import { SidePageService } from 'ngx-side-page';
import { AfterCloseSidePageService } from 'app/core/services/after-close-side-page.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-business-card',
  standalone: true,
  imports: [NgClass,MatIcon,CommonModule],
  templateUrl: './business-card.component.html',
  styleUrl: './business-card.component.scss'
})
export class BusinessCardComponent {
@Input() request:any;
@Output() close=new EventEmitter<boolean>();

constructor(private veiw:ViewRequestService,private dialog:MatDialog,private api:EmployeeRequestService,private snackBar:MatSnackBar,private sidePageService:SidePageService,private reload:AfterCloseSidePageService){
  console.log(this.request)
}
closeView(){
  this.veiw.setOpen(false)
}
showAlert(message) {
  this.snackBar.open(message, 'Close', {
      duration: 3000, // Auto close after 3 seconds
      verticalPosition: 'top', // 'top' or 'bottom'
      horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right'
      panelClass: ['custom-snackbar'], // Add custom CSS class if needed
  });
}
getFullPath(url:string){
    return environment.apiUrl+url
    }
updateRequestStatus(action: string, id: string) {
  if (action === 'rejected') {
      const dialogRef = this.dialog.open(DialogFormComponent, {
          width: '400px',
          data: { message: '' }, // Pass initial data if needed
      });
      dialogRef.afterClosed().subscribe((result) => {
          if (result) {
              let data = {
                  request_status: action,
                  reject_reason: result.message,
              };
              this.api.updateRequestStatus(data, id).subscribe({
                  next: (response) => {
                      this.showAlert('Done' + ' ' + action);
                      this.close.emit(true)
                  },
              });
          } else {
              console.log('Dialog closed without form submission');
          }
      });
  } else {
      let data = {
          request_status: action,
      };
      this.api.updateRequestStatus(data, id).subscribe({
          next: (response) => {
              this.showAlert('Done' + ' ' + action);
              this.close.emit(true)

          },
      });
  }
}
closeSidePage(){
    this.close.emit(true)
}
async updateInfo(value) {
  let data = {
      ...value,
  };
  console.log(data)
  this.close.emit(true)
  // const response: any = await this.api.getAttchemnt(value.id).toPromise(); // Convert Observable to Promise

console.log(data)
  const ref = this.sidePageService.openSidePage('create-employee-request', CreateEmployeeRequestComponent, {
      width: '40%',
      maxWidth: '600px',
      data: data,
  });
  ref.afterClosed().subscribe((result) => {
    this.reload.setValue('employee')
});
}
}
