import { NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import {
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerModule,
    MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { SidePageService } from 'ngx-side-page';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.types';
import { FilterVacationComponent } from './filter-vacation/filter-vacation.component';
import { NewVacationComponent } from './new-vacation/new-vacation.component';
import { VacationsApiService } from './vacations-api.service';
import { GetAllLeaveTypesRemainingLeavesDTO, VacationLookupResponse, Vacation } from './vacationsModels';
import { MatTooltip } from '@angular/material/tooltip';
import { ViewVacationComponent } from './view-vacation/view-vacation.component';

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
    imports: [
        MatButton,
        MatIcon,
        MatTabsModule,
        MatTableModule,
        NgIf,
        MatRipple,
        TitleCasePipe,
        MatDatepickerModule,
        MatDateRangeInput,
        MatDatepickerToggle,
        MatDateRangePicker,
        ReactiveFormsModule,
        FormsModule,
        NgForOf,
        MatFormField,
        MatIconButton,
        MatTooltip,
    ],
    templateUrl: './vacations.component.html',
    styleUrl: './vacations.component.scss',
})
export class VacationsComponent implements OnInit {
    vacations: Vacation[] = [];
    vacationsNeedApproves: Vacation[] = [];
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
        'cancel',
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
    dashboardData: GetAllLeaveTypesRemainingLeavesDTO;
    filterOpened: boolean = false;
    filteredMyRequestData: Vacation[];
    filteredEmployeesData: Vacation[];
    currentDate = Date.now();
    lookupResponse: VacationLookupResponse = {} as VacationLookupResponse;
    employeeVacationData: Vacation;
    private user: User;
    private _snackBar = inject(MatSnackBar);
    formData: {};
    constructor(
        private fb: FormBuilder,
        private sidePageService: SidePageService,
        private vacationApi: VacationsApiService,
        private userService: UserService
    ) {}

    toggleFilter() {
        let ref = this.sidePageService.openSidePage('filter-vacations', FilterVacationComponent, {
            width: '95%',
            maxWidth: '400px',
            data: {
                type: this.tabIndex,
                requests: this.tabIndex === 'myTrips' ? this.vacations : this.vacationsNeedApproves,
                formData: this.formData,
            },
        });
        ref.afterClosed().subscribe((res) => {
            console.log(res);
            if (res) {
                this.formData = res.formData;
                if (res.type === 'myTrips') {
                    this.filteredMyRequestData = res.data;
                } else {
                    this.filteredEmployeesData = res.data;
                }
            }
        });
    }

    async ngOnInit(): Promise<void> {
        const user = await firstValueFrom(this.userService.user$);
        this.user = user;
        this.reloadData();

        this.vacationApi.get_all_leave_types_remaining_leaves().subscribe((data) => {
            console.log('dashborad', data);
            this.dashboardData = data;
        });

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

    openNewBusinessTrip() {
        debugger;
        const ref = this.sidePageService.openSidePage('new-vacation', NewVacationComponent, {
            width: '40%',
            maxWidth: '600px',
        });

        ref.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            this.reloadData();
        });
    }

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

    cancel_request(time_off_request_id: number) {
        let data = {
            request_id: time_off_request_id,
            reason: 'personal',
        };
        this.vacationApi.cancel_request(data).subscribe(
            () => {
                this.vacations = this.vacations.filter((item) => (item.id === time_off_request_id ? false : true));
            },
            (error) => {
                this.openSnackBar(error.error.error);
            }
        );
    }

    private reloadData() {
        debugger;
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
  openView(value,type:string) {
         let data={
             ...value,
             type:type
         }
         console.log(data)
         const ref = this.sidePageService.openSidePage('view-vacation', ViewVacationComponent, {
             width: '95%',
             maxWidth: '400px',
             data: data,
             showCloseBtn:false,
         });
 
         ref.afterClosed().subscribe((res) => {
             console.log(res)
            this.reloadData()
         });
 
     }
}
