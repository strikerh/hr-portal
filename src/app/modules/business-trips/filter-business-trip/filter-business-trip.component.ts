import { Component, inject } from '@angular/core';
import {
    MatDatepickerModule,
    MatDatepickerToggle,
    MatDateRangeInput,
    MatDateRangePicker,
} from '@angular/material/datepicker';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo, SidePageRef } from 'ngx-side-page';
import { BusinessTripApiService } from '../business-trip-api.service';
import { Trip } from '../businessTripModels';

@Component({
  selector: 'app-filter-business-trip',
  standalone: true,
  imports: [
      MatDateRangeInput,
      ReactiveFormsModule,
      MatFormField,
      MatDatepickerToggle,
      MatDateRangePicker,
      NgFor,
      MatDatepickerModule,
      MatButtonModule,
      MatInput,
      MatLabel,
      MatSuffix,
      MatSelect,
      MatOption,
  ],
  templateUrl: './filter-business-trip.component.html',
  styleUrl: './filter-business-trip.component.scss'
})
export class FilterBusinessTripComponent {
    filterBusinessForm: FormGroup;
    requests: any[];
    readonly data: SidePageInfo<FilterBusinessTripComponent> = inject(SIDE_PAGE_DATA);
    readonly refs: SidePageRef<FilterBusinessTripComponent> = inject(SIDE_PAGE_REF);

    // lookupResponse: VacationLookupResponse = {} as VacationLookupResponse;
    tabIndex: 'myTrips' | 'tripsNeedApproves';

    constructor(
        private fb: FormBuilder,
        private businessTripApi: BusinessTripApiService,
    ) {}

    ngOnInit() {
        this.filterBusinessForm = this.fb.group({
            approval: [],
            startDate: [],
            endDate: [],
            employee: [],
            total: [],
            status: [],
            grade: [],
            type: [],
            project: [],
            maxTotal: [],
            minTotal: [],
        });
        if (this.data.data) {
            console.log(this.data.data)
            this.tabIndex = this.data.data.type;
            this.requests = this.data.data.requests;
            this.filterBusinessForm.patchValue(this.data.data.formData);
        }
    }

    filterMethod(item: Trip) {
        const filters = this.filterBusinessForm.value;
        if (filters.approval && !item.Sequence.toLowerCase().includes(filters.approval.toLowerCase())) {
            return false;
        }

        if (filters.startDate) {
            const itemStartDate = new Date(item.date_start);
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
            const itemEndDate = new Date(item.date_end);
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

        if (filters.employee && !item.employee.toLowerCase().includes(filters.employee.toLowerCase())) {
            return false;
        }
        if (filters.minTotal && item.total_compensation < filters.minTotal) {
            return false;
        }

        if (filters.maxTotal && item.total_compensation > filters.maxTotal) {
            return false;
        }
        if (filters.status && item.status.toLowerCase() !== filters.status.toLowerCase()) {
            return false;
        }

        if (filters.grade && !item.employee_grade.toLowerCase().includes(filters.grade.toLowerCase())) {
            return false;
        }

        if (filters.type && !item.trip_type.toLowerCase().includes(filters.type.toLowerCase())) {
            return false;
        }

        if (filters.project && !item.project_id.toLowerCase().includes(filters.project.toLowerCase())) {
            return false;
        }

        return true; // If all conditions pass
    }

    filter() {
        this.requests = this.requests.filter(item => this.filterMethod(item));
        this.refs.close({data:this.requests,type:this.data.data.type,formData:this.filterBusinessForm.value});
    }

    clearFilter() {
        this.filterBusinessForm.reset()
        this.refs.close({data:this.requests,type:this.data.data.type});
    }


}
