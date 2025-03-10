import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDatepickerModule,
    MatDatepickerToggle,
    MatDateRangeInput,
    MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo, SidePageRef } from 'ngx-side-page';
import { VacationsApiService } from '../vacations-api.service';
import { Vacation, VacationLookupResponse } from '../vacationsModels';

@Component({
    selector: 'app-filter-vacation',
    standalone: true,
    imports: [
        MatDateRangeInput,
        ReactiveFormsModule,
        MatFormField,
        MatDatepickerToggle,
        MatDateRangePicker,
        NgFor,
        // NgIf,
        MatDatepickerModule,
        MatButtonModule,
        MatInput,
        MatLabel,
        MatSuffix,
        MatSelect,
        MatOption,
    ],
    templateUrl: './filter-vacation.component.html',
    styleUrl: './filter-vacation.component.scss',
})
export class FilterVacationComponent implements OnInit {
    filterVactionsForm: FormGroup;
    requests: Vacation[];
    readonly data: SidePageInfo<FilterVacationComponent> = inject(SIDE_PAGE_DATA);
    readonly refs: SidePageRef<FilterVacationComponent> = inject(SIDE_PAGE_REF);

    lookupResponse: VacationLookupResponse = {} as VacationLookupResponse;
    tabIndex: 'myTrips' | 'tripsNeedApproves';

    constructor(
        private fb: FormBuilder,
        private vacationApi: VacationsApiService
    ) {}

    ngOnInit() {
        this.filterVactionsForm = this.fb.group({
            id: [],
            startDate: [],
            endDate: [],
            employee: [],
            total: [],
            status: [],
            description: [],
            type: [],
            maxTotal: [],
            minTotal: [],
        });
        if (this.data.data) {
            console.log(this.data.data)
            this.tabIndex = this.data.data.type;
            this.requests = this.data.data.requests;
            this.filterVactionsForm.patchValue(this.data.data.formData);
        }
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

    filterMethod(item: Vacation) {
        const filters = this.filterVactionsForm.value;
        if (filters.id && Number(item.id) !== Number(filters.id)) {
            return false;
        }

        if (filters.startDate) {
            const itemStartDate = new Date(item.start_date);
            const filterStartDate = new Date(filters.startDate);

            // Compare day, month, and year
            if (
                itemStartDate.getFullYear() < filterStartDate.getFullYear() ||
                (itemStartDate.getFullYear() === filterStartDate.getFullYear() &&
                    (itemStartDate.getMonth() < filterStartDate.getMonth() ||
                        (itemStartDate.getMonth() === filterStartDate.getMonth() &&
                            itemStartDate.getDate() < filterStartDate.getDate())))
            ) {
                return false;
            }
        }

        if (filters.endDate) {
            const itemEndDate = new Date(item.end_date);
            const filterEndDate = new Date(filters.endDate);

            // Compare day, month, and year
            if (
                itemEndDate.getFullYear() > filterEndDate.getFullYear() ||
                (itemEndDate.getFullYear() === filterEndDate.getFullYear() &&
                    (itemEndDate.getMonth() > filterEndDate.getMonth() ||
                        (itemEndDate.getMonth() === filterEndDate.getMonth() &&
                            itemEndDate.getDate() > filterEndDate.getDate())))
            ) {
                return false;
            }
        }

        if (filters.employee && !item.employee_name.toLowerCase().includes(filters.employee.toLowerCase())) {
            return false;
        }
        if (filters.minTotal && item.duration < filters.minTotal) {
            return false;
        }

        if (filters.maxTotal && item.duration > filters.maxTotal) {
            return false;
        }
        if (filters.status && item.state.toLowerCase() !== filters.status.toLowerCase()) {
            return false;
        }

        if (filters.description && !item.description.toLowerCase().includes(filters.description.toLowerCase())) {
            return false;
        }

        if (filters.type && !item.time_off_type.toLowerCase().includes(filters.type.toLowerCase())) {
            return false;
        }

        return true; // If all conditions pass
    }

    filter() {
        this.requests = this.requests.filter(item => this.filterMethod(item));
        this.refs.close({data:this.requests,type:this.data.data.type,formData:this.filterVactionsForm.value});
    }

    clearFilter() {
        this.filterVactionsForm.reset()
        this.refs.close({data:this.requests,type:this.data.data.type});
    }
}
