import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SidePageService } from 'ngx-side-page';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../core/user/user.service';
import { BusinessTripApiService } from './business-trip-api.service';
import { Trip } from './businessTripModels';
import { NewBusinessTripComponent } from './new-business-trip/new-business-trip.component';
import {  MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { DatePipe, NgIf } from '@angular/common';
import { MatRipple } from '@angular/material/core';

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
    ],
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
        'status',
        // 'approval_cycle_type',
        'employee_grade',
        'location_trip',
        'total_compensation',
        'total_days',
        'trip_type',
        'request_manager',
    ];
    displayedColumns2: string[] = [
        'id',
        'date_end',
        'date_start',
        'employee',
        'status',
        'approval_cycle_type',
        'employee_grade',
        'location_trip',
        'total_compensation',
        'total_days',
        'trip_type',
        'action',
        // 'request_manager'
    ];
    tabIndex: 'needApprove' | 'myTrips' = 'myTrips';

    constructor(
        private sidePageService: SidePageService,
        private businessTripApi: BusinessTripApiService,
        private userService: UserService
    ) {}

    openNewBusinessTrip() {
        this.sidePageService.openSidePage(
            'new-business-trip',
            NewBusinessTripComponent,
            {
                width: '40%',
                maxWidth: '600px',
            }
        );
    }

    async ngOnInit(): Promise<void> {
        const user = await firstValueFrom(this.userService.user$);
        this.businessTripApi
            .api_get_all_trip_by_employee_id(Number(user.employeeId))
            .subscribe((data) => {
                this.trips = data.trips;
                console.log(data);
            });

        this.businessTripApi
            .api_get_trips_to_approves_by_user_id()
            .subscribe((data) => {
                this.tripsNeedApproves = data.trips;
                console.log('tripsNeedApproves', data);
            });
    }
}
