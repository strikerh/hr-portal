import { DatePipe, DecimalPipe, NgIf, TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { SidePageService } from 'ngx-side-page';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.types';
import { BusinessTripApiService } from './business-trip-api.service';
import { Trip } from './businessTripModels';
import { NewBusinessTripComponent } from './new-business-trip/new-business-trip.component';
import { MatDatepickerModule, MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { FilterBusinessTripComponent } from './filter-business-trip/filter-business-trip.component';
import { MatTooltip } from '@angular/material/tooltip';
import { ViewBusinessTripComponent } from './view-business-trip/view-business-trip.component';

@Component({
    selector: 'app-business-trips',
    standalone: true,
    imports: [
        MatButton,
        MatIcon,
        MatTabsModule,
        MatTableModule,
        NgIf,
        DatePipe,
        MatRipple,
        TitleCasePipe,
        DecimalPipe,
        MatDatepickerModule,
        MatDateRangeInput,
        MatDatepickerToggle,
        MatDateRangePicker,
        ReactiveFormsModule,
        FormsModule,
        MatFormField,
        MatIconButton,
        MatTooltip,
    ],
    templateUrl: './business-trips.component.html',
    styleUrl: './business-trips.component.scss',
})
export class BusinessTripsComponent implements OnInit {
    trips: Trip[] = [];
    tripsNeedApproves: Trip[];
    moreInfoWrapperOpen: boolean = false;
    moreInfoWrapperData: any = {};
    filteredMyRequestData: Trip[];
    filteredEmployeeData: Trip[];
    formData: any;

    displayedColumns1: string[] = [
        // 'id',
        'Sequence',
        'date_end',
        'date_start',
        'employee',
        // 'total_days',
        // 'approval_cycle_type',
        'total_compensation',
        'status',
        'employee_grade',
        // 'location_trip',
        'trip_type',
        // 'request_manager',
        'project_id',
    ];
    displayedColumns2: string[] = [
        // 'id',
        'Sequence',
        'employee',
        'date_end',
        'date_start',
        'total_days',
        'total_compensation',
        'trip_type',
        'status',
        'my_action',
        'approval_cycle_type',
        'employee_grade',
        'location_trip',
        'action',
        'request_manager',
    ];
    displayedColumns3 = [
        'id',
        'Sequence',
        'date_end',
        'date_start',
        'employee',
        'status',
        'my_action',
        'approval_cycle_type',
        'employee_grade',
        'location_trip',
        'total_compensation',
        'total_days',
        'trip_type',
        'request_manager',
        'action',
    ];
    tabIndex: 'needApprove' | 'myTrips' = 'myTrips';
    private user: User;

    private _snackBar = inject(MatSnackBar);
    constructor(
        private fb: FormBuilder,
        private sidePageService: SidePageService,
        private businessTripApi: BusinessTripApiService,
        private userService: UserService
    ) {}

    async ngOnInit(): Promise<void> {
        const user = await firstValueFrom(this.userService.user$);
        this.user = user;
        this.reloadData();
    }

    toggleFilter() {
        let ref = this.sidePageService.openSidePage('filter-business', FilterBusinessTripComponent, {
            width: '95%',
            maxWidth: '400px',
            data: {
                type: this.tabIndex,
                requests: this.tabIndex === 'myTrips' ? this.trips : this.tripsNeedApproves,
                formData: this.formData,
            },
        });
        ref.afterClosed().subscribe((res) => {
            console.log(res);
            if(res){
            this.formData = res.formData || {};
            if (res.type === 'myTrips') {
                this.filteredMyRequestData = res.data;
            } else {
                this.filteredEmployeeData = res.data;
            } }

        });
    }

    openMoreInfo(id: number,type:string) {
        if (this.tabIndex == 'myTrips') {
            this.moreInfoWrapperData = this.trips.find((x) => x.id == id);
        } else {
            this.moreInfoWrapperData = this.tripsNeedApproves.find((x) => x.id == id);
        }
        let data={
            ...this.moreInfoWrapperData,
            type:type
        }
        console.log(data)
      let ref=this.sidePageService.openSidePage('business-trip',ViewBusinessTripComponent,{
        width:'95%',
        minWidth:'400px',
        maxWidth:'500px',
        data:data,
        showCloseBtn:false
      })
      ref.afterClosed().subscribe((res)=>{
        this.reloadData()
      })
    }
    toggle() {
        this.moreInfoWrapperOpen = !this.moreInfoWrapperOpen;
    }

    openNewBusinessTrip() {
        const ref = this.sidePageService.openSidePage('new-vacation', NewBusinessTripComponent, {
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
            this.businessTripApi.approveTrip(trip_id).subscribe((data) => {
                console.log(data);
                this.openSnackBar(data.msg);
            });
        } else {
            this.businessTripApi.refuse_trip(trip_id).subscribe((data) => {
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

    private reloadData() {
        this.businessTripApi.api_get_all_trip_by_employee_id(Number(this.user.employeeId)).subscribe((data) => {
            this.trips = data.trips
                // .map((trip: any)=>{
                //     return {
                //         ...trip,
                //         total_days: Math.floor((new Date(trip.date_end).getTime() - new Date(trip.date_start).getTime()) / (1000 * 60 * 60 * 24)),
                //     };
                // }).
                ?.sort((a, b) => b.id - a.id);
            console.log('Displayed Columns:', this.displayedColumns3);
            console.log('Trips:', data);
        });

        this.businessTripApi.api_get_trips_to_approves_by_user_id().subscribe((data) => {
            console.log('a', data);
            const g1 = data.trips?.filter((trip) => trip.my_action === 'pending')?.sort((a, b) => b.id - a.id) || [];
            const g2 = data.trips?.filter((trip) => trip.my_action !== 'pending')?.sort((a, b) => b.id - a.id) || [];
            this.tripsNeedApproves = [...g1, ...g2];

            // this.tripsNeedApproves = data.trips;

            console.log('tripsNeedApproves', data);
        });
        console.log(this.trips);
    }
}
