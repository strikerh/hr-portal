import { NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ViewRequestService } from '../view-request.service';
import { InsuranceApiService } from '../insurance-api.service';
import { environment } from 'environments/environment';
import { SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo, SidePageRef, SidePageService } from 'ngx-side-page';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AfterCloseSidePageService } from 'app/core/services/after-close-side-page.service';
import { DialogFormComponent } from 'app/modules/employee-request/dialog/dialog.component';
import { NewInsuranceComponent } from '../new-insurance/new-insurance.component';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-view-insurance',
  standalone: true,
  imports: [NgIf,NgFor,MatIcon,NgClass,MatTooltip,SlicePipe],
  templateUrl: './view-insurance.component.html',
  styleUrl: './view-insurance.component.scss'
})
export class ViewInsuranceComponent {
  @Input()request:any
  data: any={};
  files:any=[]
   readonly requestData: SidePageInfo<ViewInsuranceComponent> | null= inject(SIDE_PAGE_DATA,{ optional: true });
   readonly refs: SidePageRef<ViewInsuranceComponent> | null = inject(SIDE_PAGE_REF,{ optional: true });
  
   
constructor(
  private view:ViewRequestService,
  private api:InsuranceApiService,
  private dialog: MatDialog,
  private snackBar: MatSnackBar,
  private _sidePageSerivce:SidePageService,
  private reload:AfterCloseSidePageService
){}
ngOnInit(): void {
  console.log(this.request)
  if (this.request) {
      this.data = this.request;
      console.log(this.data);
  }
  if(this.requestData){
      console.log(this.requestData.data);
  if(this.requestData.data){
      this.data=this.requestData.data;
  }}
  window.history.pushState(null, '', window.location.href);

  window.addEventListener('popstate', (event) => this.onBackPressed());
  this.api.getAttchemnt(this.data.id).subscribe((data:any)=>{
    this.files=data.attachments;
    console.log(this.files)
  })
}
getFullPath(url:string){
return environment.apiUrl+url
}
ngOnDestroy(): void {
  this.view.setOpen(false);
}
onBackPressed() {
  this.refs.close({'e':'a'})
}
viewAttachment(url: string) {
  window.open(this.getFullUrl(url).split('?')[0], '_blank');
}

getFullUrl(url: string): string {
  return `${environment.apiUrl}${url}`;
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
                               this.refs.close()
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
                        this.refs.close()

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
               
                    const ref = this._sidePageSerivce.openSidePage('update-overtime', NewInsuranceComponent, {
                        width: '40%',
                        maxWidth: '600px',
                        data: data,
                    });
            
                    ref.afterClosed().subscribe((result) => {
                        // console.log('The dialog was closed');
                        this.reload.setValue('insuracnce')
                        
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
