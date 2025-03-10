import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ViewRequestService } from 'app/modules/employee-request/view-request.service';
import { SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo, SidePageRef, SidePageService } from 'ngx-side-page';
import { BusinessTripApiService } from '../business-trip-api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AfterCloseSidePageService } from 'app/core/services/after-close-side-page.service';
import { DialogFormComponent } from 'app/modules/employee-request/dialog/dialog.component';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-business-trip',
  standalone: true,
  imports: [CommonModule,MatIcon],
  templateUrl: './view-business-trip.component.html',
  styleUrl: './view-business-trip.component.scss'
})
export class ViewBusinessTripComponent {
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

    readonly requestData: SidePageInfo<ViewBusinessTripComponent> | null= inject(SIDE_PAGE_DATA,{ optional: true });
    readonly refs: SidePageRef<ViewBusinessTripComponent> | null = inject(SIDE_PAGE_REF,{ optional: true });

    constructor(
        private view: ViewRequestService,
        private api: BusinessTripApiService,
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
   
    ngOnDestroy(): void {
        this.view.setOpen(false);
    }
    onBackPressed() {
        this.refs.close({'ove':'a'})
    }

 
    seeMore(){
        this.refs.close({seeMore: true});
    }
    getFullPath(url:string){
        return environment.apiUrl+url
        }
    doAction(approve: 'approve' | 'reject', trip_id: number) {
      if (approve === 'approve') {
          this.api.approveTrip(trip_id).subscribe((data) => {
              console.log(data);
              this.showAlert(data.msg);
          });
      } else {
          this.api.refuse_trip(trip_id).subscribe((data) => {
              this.showAlert(data.msg);
              console.log(data);
          });
      }
  }
        
        //  async updateInfo(value) {
        //         let data = {
        //             ...value,
        //         };
        //         console.log(data);
        
        //         this.refs.close();
               
        //             const ref = this._sidePageSerivce.openSidePage('update-overtime', NewOvertimeComponent, {
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
}
