import { Component, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SidePageService } from 'ngx-side-page';
import { CreateEmployeeRequestComponent } from './create-employee-request/create-employee-request.component';
import { EmployeeRequestService } from './employee-request-api.service';
import { DatePipe, NgIf } from '@angular/common';
import { MatHeaderRowDef, MatTableModule } from '@angular/material/table';
import { MatTabBody } from '@angular/material/tabs';
import { MatRipple } from '@angular/material/core';
import { ViewEmployeeRequestComponent } from "./view-employee-request/view-employee-request.component";
import { ViewRequestService } from './view-request.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from './dialog/dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { AfterCloseSidePageService } from 'app/core/services/after-close-side-page.service';
import { FilterEmployeeRequestComponent } from './filter-employee-request/filter-employee-request.component';

@Component({
    selector: 'app-employee-request',
    standalone: true,
    imports: [
        MatIcon,
        MatButton,
        NgIf,
        MatHeaderRowDef,
        MatTableModule,
        DatePipe,
        MatRipple,
        ViewEmployeeRequestComponent,
        MatSnackBarModule,
        MatIconButton,
        MatTooltip,
    ],
    templateUrl: './employee-request.component.html',
    styleUrl: './employee-request.component.scss',
})
export class EmployeeRequestComponent implements OnInit {
    employeeRequests: any[] = [];
    requestNeedsAprroves: any[] = [];
    displayedColumns1: string[] = ['id', 'Sequence', 'date', 'type', 'status', 'Note', 'action'];
    displayedColumns2: string[] = ['id', 'Sequence', 'date', 'type', 'status', 'note', 'action'];
    tabIndex: 'my' | 'team' = 'my';
    isOpenView: boolean = false;
    selectedType: any;
    selectedRequest: any;
    filterEmployeeRequests:any;
    filterRequestNeedApproves:any
    filterData:any
    constructor(
        private sidePageService: SidePageService,
        private api: EmployeeRequestService,
        private view: ViewRequestService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private reload:AfterCloseSidePageService
    ) {}

    showAlert(message) {
        this.snackBar.open(message, 'Close', {
            duration: 3000, // Auto close after 3 seconds
            verticalPosition: 'top', // 'top' or 'bottom'
            horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right'
            panelClass: ['custom-snackbar'], // Add custom CSS class if needed
        });
    }

    ngOnInit(): void {
        this.reload.getValue().subscribe((res)=>{
            
            if(res==='employee'){
                this.getEmployeeRequest();
                this.getRequestNeedApproves();

            }
        })
        this.view.isOpen$.subscribe((value) => {
            this.isOpenView = value;
        });
        this.getEmployeeRequest();
        this.getRequestNeedApproves();
    }

    changeStatus(element: any) {
        if (element.request_status === 'HR review') {
            element.request_status = 'Direct manager';
        } else if (element.request_status === 'Direct manager') {
            element.request_status = 'HR review';
        }
    }

    openCreateEmployeeRequest() {
        console.log('done');
        const ref = this.sidePageService.openSidePage('create-employee-request', CreateEmployeeRequestComponent, {
            width: '40%',
            maxWidth: '600px',
        });

        ref.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            this.getEmployeeRequest();
        });
    }
    async updateInfo(value) {
        let data = {
            ...value,
        };
        const response: any = await this.api.getAttchemnt(value.id).toPromise(); // Convert Observable to Promise
        if (response.attachments) {
            data = { ...data, documents: response.attachments };
        }
        console.log(data);

        const ref = this.sidePageService.openSidePage('create-employee-request', CreateEmployeeRequestComponent, {
            width: '40%',
            maxWidth: '600px',
            data: data,
        });

        ref.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            this.getEmployeeRequest();
            this.getRequestNeedApproves()
        });
    }
    getEmployeeRequest() {
        this.api.getEmployeeRequest().subscribe({
            next: (response: any) => {
                this.employeeRequests = response.emp_request;
                console.log(this.employeeRequests);
            },
        });
    }
    getRequestNeedApproves() {
        this.api.getRequestNeedApproves().subscribe({
            next: (response: any) => {
                this.requestNeedsAprroves = response.requests;
                console.log(this.requestNeedsAprroves);
            },
        });
    }
    openView(value,type:string) {
        let data={
            ...value,
            type:type
        }
       let ref= this.sidePageService.openSidePage('employee-request',ViewEmployeeRequestComponent,{
            width:'98%',
            maxWidth:'400px',
            data:data,
            showCloseBtn:false
        })
        ref.afterClosed().subscribe(()=>{
            this.getEmployeeRequest()
            this.getRequestNeedApproves()
        })
    }
    showPopup = false; // Controls the visibility of the popup
    message: string;
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
                            this.getEmployeeRequest();
                            this.getRequestNeedApproves();
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
                    this.getEmployeeRequest();
                    this.getRequestNeedApproves();
                },
            });
        }
    }

    extractText(htmlString: string): string {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        return doc.body.textContent || '';
    }
    openPopup() {
        this.showPopup = true;
    }
    closePopup() {
        this.showPopup = false;
    }

    getStatus(value) {
        if (value == 'hr_review') {
            return 'HR Review';
        } else if (value == 'direct_manager') {
            return 'Direct Manager';
        } else {
            return value;
        }
    }
       toggleFilter() {
            let ref = this.sidePageService.openSidePage('filter-business', FilterEmployeeRequestComponent, {
                width: '95%',
                maxWidth: '400px',
                data: {
                    type: this.tabIndex,
                    requests: this.tabIndex === 'my' ? this.employeeRequests : this.requestNeedsAprroves,
                    formData: this.filterData,
                },
            });
            ref.afterClosed().subscribe((res) => {
                console.log(res);
                if(res){
                this.filterData = res.formData || {};
                if (res.type === 'my') {
                    this.filterEmployeeRequests = res.data;
                } else {
                    this.filterRequestNeedApproves = res.data;
                } }
    
            });
        }
}
