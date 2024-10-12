import { JsonPipe, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerModule,
    MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateTime } from 'luxon';
import { SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo, SidePageRef } from 'ngx-side-page';
import { UserService } from '../../../core/user/user.service';
import { VacationsApiService } from '../vacations-api.service';
import { VacationLookupResponse } from '../vacationsModels';

@Component({
    selector: 'app-new-vacation',
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
    templateUrl: './new-vacation.component.html',
    styleUrl: './new-vacation.component.scss',
})
export class NewVacationComponent implements OnInit {
    vacationForm: FormGroup;
    lookupResponse: VacationLookupResponse = {} as VacationLookupResponse;

    readonly data: SidePageInfo<NewVacationComponent> = inject(SIDE_PAGE_DATA);
    readonly refs: SidePageRef<NewVacationComponent> = inject(SIDE_PAGE_REF);
    private _snackBar = inject(MatSnackBar);
    durationDelta: number;
    businessTripTerm: string;
    trip_type_local: string;
    private previousValue: any;
    selectedVacationType: {
        id: number;
        name: string;
        request_unit:  'day' | 'hour';
        support_document: boolean;
    };

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private vacationApi: VacationsApiService
    ) {}

    ngOnInit() {
        this.vacationForm = this.fb.group({
            holiday_status_local: [null],
            holiday_status_id: [1],
            description: ['from API'],
            request_hour_from: ['9'],
            request_hour_to: ['9.5'],
            date_to: ['2024-11-01'],
            date_from: ['2024-11-01'],
        });

        this.vacationApi.fetchCreateTripLookup().subscribe({
            next: (response) => {
                this.lookupResponse = {
                    ...this.lookupResponse,
                    ...response,
                };
                console.log(response);
                this.selectedVacationType = this.lookupResponse.time_off_type[0] as any;
                this.vacationForm.controls['holiday_status_local'].setValue(this.lookupResponse.time_off_type[0]);
            },
            error: (error) => {
                console.error(error);
            },
        });
    }

    submit($event: SubmitEvent) {
        // this.validateForm();
        if (this.vacationForm.invalid) {
            this.openSnackBar('Please fill in all the required fields');
            return;
        }

        this.vacationForm.value['end_date'] = (this.vacationForm.value['end_date'] as DateTime)?.toISODate();
        this.vacationForm.value['start_date'] = (this.vacationForm.value['start_date'] as DateTime)?.toISODate();

        console.log(`Difference in days: ${this.durationDelta}`);
        console.log(this.vacationForm.value);
        const finalPayload = { ...this.vacationForm.value };
        if (!finalPayload['start_date']) finalPayload['start_date'] = DateTime.now().toISODate();
        if (!finalPayload['end_date']) finalPayload['end_date'] = DateTime.now().plus({ days: 1 }).toISODate();
        delete finalPayload['trip_type_local'];
        this.vacationApi.createTripRequest(finalPayload).subscribe((value) => {
            if (value) {
                this.refs.close();
            }
        });
    }

    private validateForm() {
        this.vacationForm.markAllAsTouched();
        const val = this.vacationForm.value;
        if (val['trip_type_local'] === 'business_trip') {
            if (!val['start_date'] || !val['end_date']) {
                this.vacationForm.controls['start_date'].setErrors({ required: 'Start date is required' });
                this.vacationForm.controls['end_date'].setErrors({ required: 'End date is required' });
            } else {
                this.vacationForm.controls['start_date'].setErrors(null);
                this.vacationForm.controls['end_date'].setErrors(null);
            }
        } else {
            this.vacationForm.controls['start_date'].setErrors(null);
            this.vacationForm.controls['end_date'].setErrors(null);
        }
        if (val['trip_type_local'] === 'visit_clients') {
            if (!val['number_of_trips'] || val['number_of_trips'] < 0) {
                this.vacationForm.controls['number_of_trips'].setErrors({
                    required: 'Location of the trip is required',
                });
            } else {
                this.vacationForm.controls['number_of_trips'].setErrors(null);
            }
        }

        if (val['approval_cycle_type'] === 'project') {
            if (this.vacationForm.controls['project_id'].value === null) {
                this.vacationForm.controls['project_id'].setErrors({ required: true });
            }
        }
    }

    private compare2Object(oldObj: any, newObj: any) {
        let result = {};
        for (let key in oldObj) {
            if (oldObj[key] !== newObj[key]) {
                result[key] = newObj[key];
                // break;
            }
        }
        return result;
    }

    openSnackBar(message: string, action: string = 'ok') {
        this._snackBar.open(message, action, {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000,
            panelClass: ['bg-red-500', 'mat-primary'],
            politeness: 'polite',
        });
    }

    tripTypeChanged($event: MatSelectChange) {
        this.trip_type_local = $event.value;
    }

    onDateChange($event: any) {
        const value = { ...this.vacationForm.value };
        // this.businessTripForm.valueChanges.subscribe((value) => {
        const changes = this.compare2Object(this.previousValue, value);
        if (!value) {
            return;
        }
        this.previousValue = { ...this.vacationForm.value };

        if (changes['start_date'] || changes['end_date']) {
            const startDate = value['start_date'] as DateTime;
            const endDate = value['end_date'] as DateTime;
            if (value['trip_type_local'] === 'visit_clients') {
                // setTimeout(()=> {
                this.vacationForm.controls['trip_type'].setValue('visit_clients');
                this.vacationForm.controls['start_date'].setValue(null);
                this.vacationForm.controls['end_date'].setValue(null);

                // }, 100);
            } else if (value['trip_type_local'] === 'business_trip') {
                if (startDate && endDate) {
                    this.durationDelta = Math.abs(endDate.diff(startDate, 'days').days);
                    if (this.durationDelta <= 0) {
                        this.vacationForm.controls['start_date'].setErrors({
                            endDateError: 'End date should be greater than start date',
                        });
                        this.vacationForm.controls['end_date'].setErrors({
                            endDateError: 'End date should be greater than start date',
                        });
                    } else if (this.durationDelta >= 1 && this.durationDelta <= 14) {
                        this.businessTripTerm = 'Short Term';
                        this.vacationForm.controls['trip_type'].setValue('short_term');
                    } else if (this.durationDelta >= 15 && this.durationDelta <= 90) {
                        this.businessTripTerm = 'Medium Term';
                        this.vacationForm.controls['trip_type'].setValue('medium_term');
                    } else {
                        this.businessTripTerm = 'Long Term';
                        this.vacationForm.controls['trip_type'].setValue('long_term');
                    }
                }
            }
        }
        // });
    }

    onVacationTypeChange($event: MatSelectChange) {
        this.vacationForm.controls['holiday_status_id'].setValue($event.value.id);
        this.selectedVacationType = $event.value;
        console.log($event.value);
        if ($event.value === 'visit_clients') {
            this.vacationForm.controls['trip_type'].setValue($event.value);
            this.vacationForm.controls['start_date'].reset();
            this.vacationForm.controls['end_date'].reset();
        }
        if ($event.value === 'business_trip') {
            this.vacationForm.controls['trip_type'].setValue($event.value);
        }
    }
}
