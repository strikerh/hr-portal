import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SidePageService } from 'ngx-side-page';
import { NewBusinessTripComponent } from './new-business-trip/new-business-trip.component';

@Component({
    selector: 'app-business-trips',
    standalone: true,
    imports: [MatButton, MatIcon],
    templateUrl: './business-trips.component.html',
    styleUrl: './business-trips.component.scss',
})
export class BusinessTripsComponent {
    constructor(private sidePageService: SidePageService) {}

    openNewBusinessTrip() {
        this.sidePageService.openSidePage('new-business-trip', NewBusinessTripComponent, {
           width: '40%', maxWidth: '600px'
        });
    }
}
