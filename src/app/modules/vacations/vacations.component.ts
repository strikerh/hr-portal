import { DatePipe, DecimalPipe, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { SidePageService } from 'ngx-side-page';
import { firstValueFrom } from 'rxjs';
import { UploadComponent } from '../../components/upload/upload.component';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.types';
import { NewVacationComponent } from './new-vacation/new-vacation.component';
import { VacationsApiService } from './vacations-api.service';
import { GetAllLeaveTypesRemainingLeavesDTO, vacation, VacationLookupResponse } from './vacationsModels';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Trip } from '../business-trips/businessTripModels';
import { MatDatepickerModule, MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-vacations',
    standalone: true,
    // imports: [
    //     MatButton,
    //     MatIcon,
    //     MatTabsModule,
    //     MatTableModule,
    //     NgIf,
    //     DatePipe,
    //     MatRipple,
    //     UploadComponent,
    //     NgForOf,
    //     TitleCasePipe,
    //     ReactiveFormsModule,
    //     FormsModule,
    //     MatDatepickerModule,     
    //     MatDateRangeInput,
    //     MatDatepickerToggle,
    //     MatDateRangePicker,
  
    // ],
    imports: [MatButton, MatIcon, MatTabsModule, MatTableModule, NgIf, DatePipe, MatRipple, TitleCasePipe, DecimalPipe,  MatDatepickerModule,        MatDateRangeInput,
        MatDatepickerToggle,
        MatDateRangePicker,
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    
],
    templateUrl: './vacations.component.html',
    styleUrl: './vacations.component.scss',
})
export class VacationsComponent implements OnInit {
    vacations: vacation[] = [];
    vacationsNeedApproves: vacation[]= [];
    displayedColumns1: string[] = [
        'id',
        // 'Sequence',
        'start_date',
        'end_date',
        'duration',
        'description',
        'employee_name',
        'state',
        'time_off_type',
        'cancel'
    ];
    displayedColumns2: string[] = [
        'id',
        // 'Sequence',
        'employee_name',
        'start_date',
        'end_date',
        'duration',
        'description',
        'state',
        'time_off_type',
        'action1',
    ];
    tabIndex: 'needApprove' | 'myTrips' = 'myTrips';
    private user: User;

    private _snackBar = inject(MatSnackBar);
    dashboardData: GetAllLeaveTypesRemainingLeavesDTO;
    filterOpened:boolean=false;
    filterVactionsForm:FormGroup;
    
    toggleFilter() {
        this.filterOpened=!this.filterOpened;
    }
    filteredMyRequestData:vacation[];
    filteredEmployeesData:vacation[];

    constructor(
        private fb: FormBuilder,
        private sidePageService: SidePageService,
        private vacationApi: VacationsApiService,
        private userService: UserService
    ) {}
    currentDate = Date.now();
    lookupResponse: VacationLookupResponse = {} as VacationLookupResponse;
    async ngOnInit(): Promise<void> {
        const user = await firstValueFrom(this.userService.user$);
        this.user = user;
        this.reloadData();

        this.vacationApi.get_all_leave_types_remaining_leaves().subscribe((data) => {
            console.log('dashborad',data);
            this.dashboardData = data;
        });
        this.filterVactionsForm=this.fb.group({
            id:[],
            startDate:[],
            endDate:[],
            employee:[],
            total:[],
            status:[],
            description:[],
            type:[],
            maxTotal:[],
            minTotal:[]
        })


        this.vacationApi.fetchCreateTripLookup().subscribe({
            next: (response) => {
                this.lookupResponse = {
                    ...this.lookupResponse,
                    ...response,
                };
                console.log(this.lookupResponse);
            },
            error: (error) => {
                console.error(error);
            },
        });
    
    }
    filter(){
        if (this.tabIndex == 'myTrips') {
            this.filteredMyRequestData = this.vacations.filter(this.filterMethod.bind(this)); 
          } else {
            this.filteredEmployeesData = this.vacationsNeedApproves.filter(this.filterMethod.bind(this)); 
          }          
      this.toggleFilter();
    }
    openNewBusinessTrip() {
        const ref = this.sidePageService.openSidePage('new-vacation', NewVacationComponent, {
            width: '40%',
            maxWidth: '600px',
        });

        ref.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            this.reloadData();
        });
       
    }
   filterMethod(item:vacation){
    const filters = this.filterVactionsForm.value;
        if (filters.id && Number(item.id) !== Number(filters.id)) {
            return false;
          }
      
          if (filters.startDate) {
            const itemStartDate = new Date(item.start_date);
            const filterStartDate = new Date(filters.startDate);
          
            // Compare day, month, and year
            if (
              itemStartDate.getFullYear() < filterStartDate.getFullYear() ||
              (itemStartDate.getFullYear() === filterStartDate.getFullYear() &&
                (itemStartDate.getMonth() < filterStartDate.getMonth() ||
                  (itemStartDate.getMonth() === filterStartDate.getMonth() &&
                    itemStartDate.getDate() < filterStartDate.getDate())))
            ) {
              return false;
            }
          }
          
          if (filters.endDate) {
            const itemEndDate = new Date(item.end_date);
            const filterEndDate = new Date(filters.endDate);
          
            // Compare day, month, and year
            if (
              itemEndDate.getFullYear() > filterEndDate.getFullYear() ||
              (itemEndDate.getFullYear() === filterEndDate.getFullYear() &&
                (itemEndDate.getMonth() > filterEndDate.getMonth() ||
                  (itemEndDate.getMonth() === filterEndDate.getMonth() &&
                    itemEndDate.getDate() > filterEndDate.getDate())))
            ) {
              return false;
            }
          }
          
  
      
          if (filters.employee && !item.employee_name.toLowerCase().includes(filters.employee.toLowerCase())) {
            return false;
          }
          if (filters.minTotal && item.duration < filters.minTotal) {
            return false;
          }
          
          if (filters.maxTotal && item.duration > filters.maxTotal) {
            return false;
          }
          if (filters.status && item.state.toLowerCase() !== filters.status.toLowerCase()) {
            return false;
          }
      
          if (filters.description && !item.description.toLowerCase().includes(filters.description.toLowerCase())) {
            return false;
          }
      
          if (filters.type && !item.time_off_type.toLowerCase().includes(filters.type.toLowerCase())) {
            return false;
          }
      
          return true; // If all conditions pass
        };
    doAction(approve: 'approve' | 'reject', trip_id: number) {
        if (approve === 'approve') {
            this.vacationApi.approveTrip(trip_id).subscribe(
                (data) => {
                    console.log(data);
                    this.openSnackBar(data.msg);
                },
                (error) => {
                    if (error.error.error) {
                        this.openSnackBar(error.error.error);
                    }
                    console.error(error);
                }
            );
        } else {
            this.vacationApi.refuse_trip(trip_id).subscribe((data) => {
                this.openSnackBar(data.msg);
                console.log(data);
            });
        }
        this.reloadData();
    }

    openSnackBar(message: string, action: string = 'ok') {
        this._snackBar.open(message, action, {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000,
        });
    }
    cancel_request(time_off_request_id: number){
        let data={
            'request_id':time_off_request_id,
            'reason':"personal"
        }
this.vacationApi.cancel_request(data).subscribe(()=>{
    
this.vacations=this.vacations.filter((item)=>item.id===time_off_request_id?false:true);
},(error)=>{
    this.openSnackBar(error.error.error)
}

)
    }
    employeeVacationData:vacation;
    private reloadData() {
        this.vacationApi.api_get_all_vacation_by_employee_id().subscribe((data) => {
            this.vacations = data.time_off_list
                /*    .map((vacation: any)=>{
                    return {
                        ...vacation,
                        total_days: Math.floor((new Date(vacation.date_end).getTime() - new Date(vacation.date_start).getTime()) / (1000 * 60 * 60 * 24)),
                    };
                }).*/
                .sort((a, b) => b.id - a.id);
            console.log(data);
        });

        this.vacationApi.api_get_vacation_to_approves_by_user_id().subscribe((data) => {
            // const g1 = data.time_off_list?.filter((trip) => trip.my_action === 'pending')?.sort((a, b) => b.id - a.id);
            // const g2 = data.time_off_list?.filter((trip) => trip.my_action !== 'pending')?.sort((a, b) => b.id - a.id);
            // this.tripsNeedApproves = [...g1, ...g2]

            this.vacationsNeedApproves = data.time_off_list;

            console.log('tripsNeedApproves', this.vacationsNeedApproves);
        });
//         this.vacationApi.get_team_remaining_leaves().subscribe((data)=>{
// this.employeeVacationData=data;
// console.log(data)
//         })
    }
}
