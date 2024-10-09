import { DatePipe, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
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

@Component({
    selector: 'app-business-trips',
    standalone: true,
    imports: [MatButton, MatIcon, MatTabsModule, MatTableModule, NgIf, DatePipe, MatRipple],
    templateUrl: './business-trips.component.html',
    styleUrl: './business-trips.component.scss',
})
export class BusinessTripsComponent implements OnInit {
    trips: Trip[] = [];
    tripsNeedApproves: Trip[];
    displayedColumns1: string[] = [
        'id',
        'date_end',
        'date_start',
        // 'employee',
        'total_days',
        // 'approval_cycle_type',
        'total_compensation',
        'status',
        'employee_grade',
        // 'location_trip',
        'trip_type',
        'request_manager',
    ];
    displayedColumns2: string[] = [
        'id',
        'employee',
        'date_end',
        'date_start',
        'total_days',
        'total_compensation',
        'trip_type',
        'status',
        'approval_cycle_type',
        'employee_grade',
        'location_trip',
        'action',
        // 'request_manager'
    ];
    tabIndex: 'needApprove' | 'myTrips' = 'myTrips';
    private user: User;

    private _snackBar = inject(MatSnackBar);

    constructor(
        private sidePageService: SidePageService,
        private businessTripApi: BusinessTripApiService,
        private userService: UserService
    ) {}

    async ngOnInit(): Promise<void> {
        const user = await firstValueFrom(this.userService.user$);
        this.user = user;
        this.reloadData();
    }

    openNewBusinessTrip() {
        const ref = this.sidePageService.openSidePage('new-business-trip', NewBusinessTripComponent, {
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
                .map((trip: any)=>{
                    return {
                        ...trip,
                        total_days: Math.floor((new Date(trip.date_end).getTime() - new Date(trip.date_start).getTime()) / (1000 * 60 * 60 * 24)),
                    };
                }).
            sort((a, b) => b.id - a.id);            console.log(data);
        });

        this.businessTripApi.api_get_trips_to_approves_by_user_id().subscribe((data) => {
            this.tripsNeedApproves = data.trips;
            console.log('tripsNeedApproves', data);
        });
    }
}
