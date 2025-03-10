import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewRequestService } from '../../view-request.service';
import { NgClass, NgFor, NgForOf, NgIf, SlicePipe } from '@angular/common';
import { EmployeeRequestService } from '../../employee-request-api.service';
import { environment } from 'environments/environment';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from '../../dialog/dialog.component';
import { CreateEmployeeRequestComponent } from '../../create-employee-request/create-employee-request.component';
import { SidePageService } from 'ngx-side-page';
import { AfterCloseSidePageService } from 'app/core/services/after-close-side-page.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-salary-clearance',
  standalone: true,
  imports: [NgIf,NgClass,NgForOf,NgFor,MatIcon,SlicePipe,MatTooltip],
  templateUrl: './salary-clearance.component.html',
  styleUrl: './salary-clearance.component.scss'
})
export class SalaryClearanceComponent implements OnInit {
@Input() request:any;
attachments=[];
@Output() close=new EventEmitter<boolean>();

constructor(private veiw:ViewRequestService,private api:EmployeeRequestService,private dialog:MatDialog,private snackBar:MatSnackBar,private sidePageService:SidePageService,private reload:AfterCloseSidePageService){
  console.log(this.request)
}
closeView(){
  this.veiw.setOpen(false)
}
ngOnInit(): void {
  this.api.getAttchemnt(this.request.id).subscribe((response:any)=>{
    console.log(response)
    this.attachments=response.attachments
  })
}

viewAttachment(url: string) {
  window.open(this.getFullUrl(url).split('?')[0], '_blank');
}

getFullUrl(url: string): string {
  return `${environment.apiUrl}${url}`;
}
showAlert(message) {
  this.snackBar.open(message, 'Close', {
      duration: 3000, // Auto close after 3 seconds
      verticalPosition: 'top', // 'top' or 'bottom'
      horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right'
      panelClass: ['custom-snackbar'], // Add custom CSS class if needed
  });
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

async updateInfo(value) {
        let data = {
            ...value,
        };
        console.log(data)
        this.close.emit(true)
        // const response: any = await this.api.getAttchemnt(value.id).toPromise(); // Convert Observable to Promise
        if (this.attachments) {
            data = { ...data, documents: this.attachments };
        }
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
    
    closeSidePage(){
      this.close.emit(true)
  }
}
