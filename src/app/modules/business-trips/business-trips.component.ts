import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SidePageService } from 'ngx-side-page';
import { BusinessTripApiService } from './business-trip-api.service';
import { NewBusinessTripComponent } from './new-business-trip/new-business-trip.component';
import { UserService } from '../../core/user/user.service';
import { Trip } from './businessTripModels';

@Component({
    selector: 'app-business-trips',
    standalone: true,
    imports: [MatButton, MatIcon],
    templateUrl: './business-trips.component.html',
    styleUrl: './business-trips.component.scss',
})
export class BusinessTripsComponent implements OnInit {
    trips: Trip[] = [];
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

    ngOnInit(): void {
        this.userService.user$.subscribe((user) => {

            this.businessTripApi
                .api_get_all_trip_by_employee_id(Number(user.id))
                .subscribe((data) => {
                    this.trips = data.trips;
                    console.log(data);
                });

        });

    }

}
