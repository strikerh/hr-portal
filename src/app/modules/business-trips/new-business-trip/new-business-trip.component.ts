import { JsonPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerModule,
    MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
    MatFormField,
    MatFormFieldModule,
    MatHint,
    MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatOption, MatSelect } from '@angular/material/select';
import { UserService } from '../../../core/user/user.service';
import { BusinessTripApiService } from '../business-trip-api.service';
import { CreateTripLookupResponse } from '../businessTripModels';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-new-business-trip',
    standalone: true,
    imports: [
        MatFormField,
        MatInput,
        MatLabel,
        MatSelect,
        MatOption,
        MatRadioGroup,
        MatRadioButton,
        MatDateRangeInput,
        MatDatepickerToggle,
        MatDateRangePicker,
        ReactiveFormsModule,
        MatHint,

        MatFormFieldModule,
        MatDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
        JsonPipe,
        NgIf,
    ],
    templateUrl: './new-business-trip.component.html',
    styleUrl: './new-business-trip.component.scss',
})
export class NewBusinessTripComponent {
    businessTripForm: FormGroup;
    tripLookupResponse: CreateTripLookupResponse = {
        projects: [],
        other_trip_types: [],
        approval_types: [],

    };
    tripTypes: { value: string; viewValue: string }[] = [
        { value: 'steak-0', viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'tacos-2', viewValue: 'Tacos' },
    ];

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private businessTripApi: BusinessTripApiService
    ) {}

    ngOnInit() {
        this.businessTripForm = this.fb.group({
            trip_type: ['visit_clients'],
            employee_id: [0],
            location_of_the_trip: ['Dubai, UAE'],
            start_date: ['2024-10-01'],
            end_date: ['2024-10-05'],
            distance: ['200_above'],
            approval_cycle_type: ['project'],
            accommodation_paid_by_company: [false],
            international_trip: [false],
            car_provided: [false],
            tickets_allowance: [true],
            category_id: [1],

            project_id: [1],
            number_of_trips: [5],
        });

        forkJoin([
            this.businessTripApi.fetchCreateTripLookup(),
            this.userService.user$,
        ]).subscribe(([response, user]) => {
            this.tripLookupResponse = response;
            this.businessTripForm.controls['employee_id'].setValue(user.id);
            console.log(response);
            console.log(user);
        });
    }
}
