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
import { BusinessTripApiService } from '../business-trip-api.service';
import { CreateTripLookupResponse } from '../businessTripModels';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
        MatProgressSpinner
    ],
    templateUrl: './new-business-trip.component.html',
    styleUrl: './new-business-trip.component.scss',
})
export class NewBusinessTripComponent implements OnInit {

    businessTripForm: FormGroup;
    tripLookupResponse: CreateTripLookupResponse = {
        projects: [],
        other_trip_types: [],
        approval_types: [],
        distance_categories: [],
        categories: [{ id: 1, name: 'Business Trip' }],
    };

    readonly data: SidePageInfo<NewBusinessTripComponent> = inject(SIDE_PAGE_DATA);
    readonly refs: SidePageRef<NewBusinessTripComponent> = inject(SIDE_PAGE_REF);
    private _snackBar = inject(MatSnackBar);
    durationDelta: number;
    businessTripTerm: string;
    trip_type_local: string;
    private previousValue: any;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private businessTripApi: BusinessTripApiService
    ) {}
    
    business_tripData=localStorage.getItem("business_trip");

    ngOnInit() {
        this.businessTripForm = this.fb.group({
            trip_type_local: ['business_trip', Validators.required],
            trip_type: ['', Validators.required],
            employee_id: [null, Validators.required],
            location_of_the_trip: [null, Validators.required],
            start_date: [''],
            end_date: [''],
            distance: [''],
            approval_cycle_type: ['', Validators.required],
            accommodation_paid_by_company: [false],
            international_trip: [false],
            car_provided: [false],
            tickets_allowance: [false],
            category_id: [1, Validators.required],

            project_id: [null],
            number_of_trips: [1],
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
            this.businessTripForm.controls['employee_id'].setValue(user.employeeId);
            console.log(user);
        });
        if(this.business_tripData){
            this._snackBar.open('You have draft here is the pre', 'ok', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 5000,
                panelClass: ['bg-red-500', 'mat-primary'],
                politeness: 'polite',
            });
            this.businessTripForm.setValue(JSON.parse(this.business_tripData));
        }
    }
    saveBusinessTrip() {
        localStorage.setItem("business_trip",JSON.stringify(this.businessTripForm.value));
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
        const value = { ...this.businessTripForm.value };
        // this.businessTripForm.valueChanges.subscribe((value) => {
        const changes = this.compare2Object(this.previousValue, value);
        if (!value) {
            return;
        }
        this.previousValue = { ...this.businessTripForm.value };

        if (changes['start_date'] || changes['end_date']) {
            const startDate = value['start_date'] as DateTime;
            const endDate = value['end_date'] as DateTime;
            if (value['trip_type_local'] === 'visit_clients') {
                // setTimeout(()=> {
                this.businessTripForm.controls['trip_type'].setValue('visit_clients');
                this.businessTripForm.controls['start_date'].setValue(null);
                this.businessTripForm.controls['end_date'].setValue(null);

                // }, 100);
            } else if (value['trip_type_local'] === 'business_trip') {
                if (startDate && endDate) {
                    this.durationDelta = Math.abs(endDate.diff(startDate, 'days').days)+1;
                   
                    if (this.durationDelta <= 0) {
                        this.businessTripForm.controls['start_date'].setErrors({
                            endDateError: 'End date should be greater than start date',
                        });
                        this.businessTripForm.controls['end_date'].setErrors({
                            endDateError: 'End date should be greater than start date',
                        });
                    } else if (this.durationDelta >= 1 && this.durationDelta <= 14) {
                        this.businessTripTerm = 'Short Term';
                        this.businessTripForm.controls['trip_type'].setValue('short_term');
                    } else if (this.durationDelta >= 15 && this.durationDelta <= 90) {
                        this.businessTripTerm = 'Medium Term';
                        this.businessTripForm.controls['trip_type'].setValue('medium_term');
                    } else {
                        this.businessTripTerm = 'Long Term';
                        this.businessTripForm.controls['trip_type'].setValue('long_term');
                    }
                }
            }
        }
        // });
    }

    onTrip_type_localChange($event: MatSelectChange) {
        if ($event.value === 'visit_clients') {
            this.businessTripForm.controls['trip_type'].setValue($event.value);
            this.businessTripForm.controls['start_date'].reset();
            this.businessTripForm.controls['end_date'].reset();
        }
        if ($event.value === 'business_trip') {
            this.businessTripForm.controls['trip_type'].setValue($event.value);
        }
    }
buttonDisabled:boolean=false;
    submit($event: SubmitEvent) {
        this.validateForm();
        if (this.businessTripForm.invalid) {
            this.openSnackBar('Please fill in all the required fields');
            return;
        }
        this.buttonDisabled=true;
console.log(this.businessTripForm)
        const finalPayload = { ...this.businessTripForm.value };
        finalPayload['end_date'] = (this.businessTripForm.value['end_date'] as DateTime)?.toISODate();
        finalPayload['start_date'] = (this.businessTripForm.value['start_date'] as DateTime)?.toISODate();

        console.log(`Difference in days: ${this.durationDelta}`);
        console.log(this.businessTripForm.value);

        if (!finalPayload['start_date']) finalPayload['start_date'] = DateTime.now().toISODate();
        if (!finalPayload['end_date']) finalPayload['end_date'] = DateTime.now().plus({ days: 1 }).toISODate();
        if(this.businessTripForm.value['trip_type_local'] !== 'visit_clients') {
            finalPayload['number_of_trips'] = 0;
        }
        delete finalPayload['trip_type_local'];
        console.log(finalPayload);
        this.businessTripApi.createTripRequest(finalPayload).subscribe((value) => {
            console.log(value)
            this.buttonDisabled=false;
            if(this.business_tripData){
                localStorage.removeItem("business_trip")
            }
            if (value) {
                this.refs.close();
            }
        },(error)=>{
            this.buttonDisabled=false;
            this.handleError(error.error)
        }
    
    );
    }
    showError:boolean = false;
    errorInfo:string;
    handleError(error: any): void {
      this.showError = true;
      this.errorInfo=error;
      
    }
    
    closeAlert(): void {
      this.showError = false;
    }
    private validateForm() {
        this.businessTripForm.markAllAsTouched();
        const val = this.businessTripForm.value;
        if (val['trip_type_local'] === 'business_trip') {
            if (!val['start_date'] || !val['end_date']) {
                this.businessTripForm.controls['start_date'].setErrors({ required: 'Start date is required' });
                this.businessTripForm.controls['end_date'].setErrors({ required: 'End date is required' });
            } else {
                this.businessTripForm.controls['start_date'].setErrors(null);
                this.businessTripForm.controls['end_date'].setErrors(null);
            }
        } else {
            this.businessTripForm.controls['start_date'].setErrors(null);
            this.businessTripForm.controls['end_date'].setErrors(null);
        }
        if (val['trip_type_local'] === 'visit_clients') {
            if (!val['number_of_trips'] || val['number_of_trips'] < 0) {
                this.businessTripForm.controls['number_of_trips'].setErrors({
                    required: 'Location of the trip is required',
                });
            } else {
                this.businessTripForm.controls['number_of_trips'].setErrors(null);
            }
        }

        if (val['approval_cycle_type'] === 'project') {
            if (this.businessTripForm.controls['project_id'].value === null) {
                this.businessTripForm.controls['project_id'].setErrors({ required: true });
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
}
