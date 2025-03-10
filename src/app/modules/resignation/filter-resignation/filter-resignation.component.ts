import { CommonModule, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule, MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo, SidePageRef } from 'ngx-side-page';
import { resignationApiService } from '../resignation-api.service';

@Component({
  selector: 'app-filter-resignation',
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
    CommonModule,
    MatHint
],
  templateUrl: './filter-resignation.component.html',
  styleUrl: './filter-resignation.component.scss'
})
export class FilterResignationComponent {
 filterForm: FormGroup;
    requests: any[];
    readonly data: SidePageInfo<FilterResignationComponent> = inject(SIDE_PAGE_DATA);
    readonly refs: SidePageRef<FilterResignationComponent> = inject(SIDE_PAGE_REF);

    // lookupResponse: VacationLookupResponse = {} as VacationLookupResponse;
    tabIndex: 'my' | 'team';

    constructor(
        private fb: FormBuilder,
        private api: resignationApiService,
    ) {}

    ngOnInit() {
        this.filterForm = this.fb.group({
          employee: [],
          date: [],
            status: [],
        });
        if (this.data.data) {
            console.log(this.data.data)
            this.tabIndex = this.data.data.type;
            this.requests = this.data.data.requests;
            this.filterForm.patchValue(this.data.data.formData);
        }
    }

    filterMethod(item: any) {
        const filters = this.filterForm.value;
    

        if (filters.employee && !item.employee_name.toLowerCase().includes(filters.employee.toLowerCase())) {
            return false;
        }
        
        if (filters.status && item.request_status.toLowerCase() !== filters.status.toLowerCase()) {
            return false;
        }
    
        if (filters.date ) {
          let dateStr = filters.date.toString().split('T')[0];
          if(item.request_date!=dateStr){
            return false;
          }
        }
        return true; // If all conditions pass
    }

    filter() {
        this.requests = this.requests.filter(item => this.filterMethod(item));
        this.refs.close({data:this.requests,type:this.data.data.type,formData:this.filterForm.value});
    }

    clearFilter() {
        this.filterForm.reset()
        this.refs.close({data:this.requests,type:this.data.data.type});
    }


}
