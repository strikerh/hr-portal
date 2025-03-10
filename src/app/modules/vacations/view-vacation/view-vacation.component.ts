import { Component, inject, Input } from '@angular/core';
import { ViewRequestService } from 'app/modules/employee-request/view-request.service';
import { SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo, SidePageRef, SidePageService } from 'ngx-side-page';
import { VacationsApiService } from '../vacations-api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AfterCloseSidePageService } from 'app/core/services/after-close-side-page.service';
import { NewVacationComponent } from '../new-vacation/new-vacation.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton, MatIconButton } from '@angular/material/button';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-vacation',
  standalone: true,
  imports: [MatIcon, MatButton, MatTableModule, NgIf, DatePipe, MatIconButton, MatTooltip,CommonModule],
  templateUrl: './view-vacation.component.html',
  styleUrl: './view-vacation.component.scss'
})
export class ViewVacationComponent {
  @Input() request: any;
    files: any;
    projects: any[] = [];
    salaryInfo: any;
    totalSalary: number;
    wage: number;
    workingHours: number;
    totalPaidForWorkingDay: number;
    totalPaidForWorkingHoliday: number;
    data: any={};
    sidePage: boolean = false;

    readonly requestData: SidePageInfo<ViewVacationComponent> | null= inject(SIDE_PAGE_DATA,{ optional: true });
    readonly refs: SidePageRef<ViewVacationComponent> | null = inject(SIDE_PAGE_REF,{ optional: true });

    constructor(
        private view: ViewRequestService,
        private api: VacationsApiService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private _sidePageSerivce:SidePageService,
        private reload:AfterCloseSidePageService
    ) {}
    ngOnInit(): void {
        console.log(this.request);
        if (this.request) {
            this.data = this.request;
            console.log(this.data);
        }
        if(this.requestData){
            console.log(this.requestData.data);
        if(this.requestData.data){
            this.data=this.requestData.data;
            this.sidePage=true
        }}
        window.history.pushState(null, '', window.location.href);

        window.addEventListener('popstate', (event) => this.onBackPressed());
       
    }
    getProjectName(id) {
        console.log(id)
        return this.projects.find((m) => m.id === id)?.name || '';
    }
    ngOnDestroy(): void {
        this.view.setOpen(false);
    }
    onBackPressed() {
        this.refs.close({'ove':'a'})
    }

  
    seeMore(){
        this.refs.close({seeMore: true});
    }

  
        
        //  async updateInfo(value) {
        //         let data = {
        //             ...value,
        //         };
        //         console.log(data);
        
        //         this.refs.close();
               
        //             const ref = this._sidePageSerivce.openSidePage('update-overtime', NewVacationComponent, {
        //                 width: '40%',
        //                 maxWidth: '600px',
        //                 data: data,
        //             });
            
        //             ref.afterClosed().subscribe((result) => {
        //                 // console.log('The dialog was closed');
        //                 this.reload.setValue('overtime')
                        
        //             });
                
               
        //     }

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
        cancel_request(time_off_request_id: number) {
          let data = {
              request_id: time_off_request_id,
              reason: 'personal',
          };
          this.api.cancel_request(data).subscribe(
              () => {

this.refs.close()         
     },
              (error) => {
                  this.showAlert(error.error.error);
              }
          );
      }
      doAction(approve: 'approve' | 'reject', trip_id: number) {
        if (approve === 'approve') {
            this.api.approveTrip(trip_id).subscribe(
                (data) => {
                    console.log(data);
                    this.showAlert(data.msg);
                },
                (error) => {
                    if (error.error.error) {
                        this.showAlert(error.error.error);
                    }
                    console.error(error);
                }
            );
        } else {
            this.api.refuse_trip(trip_id).subscribe((data) => {
                this.showAlert(data.msg);
                console.log(data);
            });
        }
        this.refs.close()
    }
}
