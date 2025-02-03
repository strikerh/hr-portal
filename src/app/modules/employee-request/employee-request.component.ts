import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SidePageService } from 'ngx-side-page';
import { CreateEmployeeRequestComponent } from './create-employee-request/create-employee-request.component';
import { EmployeeRequestService } from './employee-request-api.service';
import { DatePipe, NgIf } from '@angular/common';
import { MatHeaderRowDef, MatTableModule } from '@angular/material/table';
import { MatTabBody } from '@angular/material/tabs';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-employee-request',
  standalone: true,
  imports: [MatIcon,MatButton,NgIf,MatHeaderRowDef,MatTableModule,DatePipe,MatRipple],
  templateUrl: './employee-request.component.html',
  styleUrl: './employee-request.component.scss'
})
export class EmployeeRequestComponent implements OnInit {
    employeeRequests: any[] = [];

    displayedColumns1: string[] = [
        // 'id',
        // 'Sequence',
        'date',
        'type',
        'status',
        // 'Note',
        'action'
    ];
    tabIndex:'my'|'team'='my'
  constructor(private sidePageService: SidePageService , private api:EmployeeRequestService ){}

  ngOnInit(): void {
    this.getEmployeeRequest()
  }

   openCreateEmployeeRequest() {
    console.log("done")
        const ref = this.sidePageService.openSidePage('create-employee-request', CreateEmployeeRequestComponent, {
            width: '40%',
            maxWidth: '600px',
        });

        ref.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            this.getEmployeeRequest()

        });
       
    }
    getEmployeeRequest(){
        this.api.getEmployeeRequest().subscribe({
            next:(response:any)=>{
                console.log(response)
                let employeeRequests: any[] = [];

                Object.entries(response.emp_request).forEach(([requestType, requests]: any) => {
                  if (requests && requests.length > 0) {
                    requests.forEach((request: any) => {
                      employeeRequests.push({
                        requestType,
                        requestDate: request.request_date,
                        requestStatus: request.request_status,
                        request
                      });
                    });
                  }
                });
          
                // Ensure that Angular is aware of the changes by setting a new reference
                this.employeeRequests = [...employeeRequests];

      console.log(this.employeeRequests);   
             }
        })
    }
}
