import { JsonPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
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
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';

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
        MatCheckbox,
        MatDivider,
        MatButton,
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
        distances: [
            { key: '700_below', name: 'Below 70km' },
            { key: 'between_70_200', name: 'Between 70km and below 200km' },
            { key: '200_above', name: 'Above 200km' },
        ],
        categories: [{ id: 1, name: 'Business Trip' }],
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
            trip_type: [''],
            employee_id: [null],
            location_of_the_trip: [null],
            start_date: [''],
            end_date: [''],
            distance: [''],
            approval_cycle_type: [''],
            accommodation_paid_by_company: [false],
            international_trip: [false],
            car_provided: [false],
            tickets_allowance: [false],
            category_id: [null],

            project_id: [null],
            number_of_trips: [0],
        });
        this.businessTripApi.fetchCreateTripLookup().subscribe({
            next: (response) => {
                this.tripLookupResponse = {
                    ...this.tripLookupResponse,
                    ...response,
                };
                console.log(response);
            },
            error: (error) => {
                console.error(error);
            },
        });

        this.userService.user$.subscribe((user) => {
            this.businessTripForm.controls['employee_id'].setValue(user.id);
            console.log(user);
        });
    }
}
