import { Component, inject, Input, OnInit } from '@angular/core';
import { ViewRequestService } from '../view-request.service';
import { NgClass, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo, SidePageRef, SidePageService } from 'ngx-side-page';
import { MatButton } from '@angular/material/button';
import { NewOvertimeComponent } from 'app/modules/overtime/new-overtime/new-overtime.component';
import { DialogFormComponent } from 'app/modules/employee-request/dialog/dialog.component';
import { resignationApiService } from '../resignation-api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AfterCloseSidePageService } from 'app/core/services/after-close-side-page.service';
import { DialogDateFormComponent } from 'app/modules/employee-request/dialog/dialog-date.component';
import { NewResignationComponent } from '../new-resignation/new-resignation.component';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-view-resignation',
    standalone: true,
    imports: [NgIf, MatIcon, NgClass, MatButton],
    templateUrl: './view-resignation.component.html',
    styleUrl: './view-resignation.component.scss',
})
export class ViewResignationComponent implements OnInit {
    @Input() request: any;
    data: any;
    sidePage: boolean = false;
    readonly requestData: SidePageInfo<ViewResignationComponent> | null = inject(SIDE_PAGE_DATA, { optional: true });
    readonly refs: SidePageRef<ViewResignationComponent> | null = inject(SIDE_PAGE_REF, { optional: true });

    constructor(
        private view: ViewRequestService
        , private api: resignationApiService,
        private _sidePageSerivce: SidePageService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private reload: AfterCloseSidePageService

    ) { }
    ngOnInit(): void {
        console.log(this.request);
        if (this.request) {
            this.data = this.request;
            console.log(this.data)
        }
        if (this.requestData && this.requestData.data) {
            this.data = this.requestData.data;
            this.sidePage = true;
        }
        window.history.pushState(null, '', window.location.href);

        window.addEventListener('popstate', (event) => this.onBackPressed());
    }
    ngOnDestroy(): void {
        this.view.setOpen(false);
    }
    onBackPressed() {
        this.refs.close({'res':'a'})
    }

    seeMore() {
        this.refs.close({ seeMore: true });
    }
    getFullPath(url:string){
        return environment.apiUrl+url
        }
    updateRequestStatus(action: string, id: string, status?: string) {
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

                        },
                    });
                } else {
                    console.log('Dialog closed without form submission');
                }
            });
        } else if (action === 'approved') {
            if (status == 'department_manager' || status === 'project_manager') {
                let data = {
                    request_status: action,
                };
                console.log(id);

                this.api.updateRequestStatus(data, id).subscribe({
                    next: (response) => {
                        this.showAlert('Request ' + action);

                    },
                });
            } else {
                const dialogRef = this.dialog.open(DialogDateFormComponent, {
                    width: '400px',
                    data: { message: '' }, // Pass initial data if needed
                });
                dialogRef.afterClosed().subscribe((result) => {
                    if (result) {
                        let data = {
                            request_status: action,
                            actual_last_date: result.selectedDate,
                        };
                        this.api.updateRequestStatus(data, id).subscribe({
                            next: (response) => {
                                this.showAlert('Request ' + action);

                            },
                        });
                    } else {
                        console.log('Dialog closed without form submission');
                    }
                });
            }
        } else {
            let data = {
                request_status: action,
            };
            this.api.updateRequestStatus(data, id).subscribe({
                next: (response) => {
                    this.showAlert('Request ' + action);
                    // this.getRequestNeedApproves()
                },
            });
        }
    }

    async updateInfo(value) {
        let data = {
            ...value,
        };
        console.log(data);

        this.refs.close();

        const ref = this._sidePageSerivce.openSidePage('update-overtime', NewResignationComponent, {
            width: '40%',
            maxWidth: '600px',
            data: data,
        });

        ref.afterClosed().subscribe((result) => {
            // console.log('The dialog was closed');
            this.reload.setValue('resignation')

        });


    }

    showAlert(message) {
        this.snackBar.open(message, 'Close', {
            duration: 3000, // Auto close after 3 seconds
            verticalPosition: 'top', // 'top' or 'bottom'
            horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right'
            panelClass: ['custom-snackbar'], // Add custom CSS class if needed
        });
    }
}
