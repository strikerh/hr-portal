import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SidePageService } from 'ngx-side-page';
import { NewInsuranceComponent } from './new-insurance/new-insurance.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DatePipe, NgIf } from '@angular/common';
import { InsuranceApiService } from './insurance-api.service';
import { ViewInsuranceComponent } from "./view-insurance/view-insurance.component";
import { ViewRequestService } from './view-request.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from '../employee-request/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AfterCloseSidePageService } from 'app/core/services/after-close-side-page.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-insurance',
    standalone: true,
    imports: [MatIcon, MatButton, MatTableModule, NgIf, DatePipe, ViewInsuranceComponent, MatIconButton, MatTooltip],
    templateUrl: './insurance.component.html',
    styleUrl: './insurance.component.scss',
})
export class InsuranceComponent implements OnInit {
    employeeRequest: any[] = [];
    requestNeedApproves: any[] = [];
    tabIndex: 'my' | 'team' = 'my';
    displayedColumns1: string[] = ['id', 'Sequence', 'date', 'type', 'status', 'Note', 'action'];
    isOpenView: boolean = false;
    selectedRequest: any;

    showAlert(message) {
        this.snackBar.open(message, 'Close', {
            duration: 3000, // Auto close after 3 seconds
            verticalPosition: 'top', // 'top' or 'bottom'
            horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right'
            panelClass: ['custom-snackbar'], // Add custom CSS class if needed
        });
    }
    constructor(
        private sidePageSerivce: SidePageService,
        private api: InsuranceApiService,
        private view: ViewRequestService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private reload: AfterCloseSidePageService
    ) {}
    ngOnInit(): void {
        this.reload.getValue().subscribe((value) => {
            console.log(value);
            if (value) {
                this.getEmployeeRequest();
                this.getRequestNeedApproves();
            }
        });

        this.view.isOpen$.subscribe((value) => {
            this.isOpenView = value;
        });

        this.getEmployeeRequest();
        this.getRequestNeedApproves();
    }

    requestInsurance() {
        let ref = this.sidePageSerivce.openSidePage('insurance', NewInsuranceComponent, {
            width: '40%',
            maxWidth: '600px',
        });
        ref.afterClosed().subscribe((value) => {});
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
                            this.showAlert('Request ' + action);
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
                    this.showAlert('Request ' + action);
                    this.getEmployeeRequest();
                    this.getRequestNeedApproves();
                },
            });
        }
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

        const ref = this.sidePageSerivce.openSidePage('create-employee-request', NewInsuranceComponent, {
            width: '40%',
            maxWidth: '600px',
            data: data,
        });

        ref.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            this.getEmployeeRequest();
        });
    }
    getEmployeeRequest() {
        this.api.getEmployeeRequests().subscribe((data: any) => {
            this.employeeRequest = data.emp_request;
            console.log(data);
        });
    }
    getRequestNeedApproves() {
        this.api.getRequestNeedApproves().subscribe((data: any) => {
            this.requestNeedApproves = data.emp_request;
            console.log(data);
        });
    }
    openView(value) {
        this.selectedRequest = value;
        this.view.setOpen(true);
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
}
