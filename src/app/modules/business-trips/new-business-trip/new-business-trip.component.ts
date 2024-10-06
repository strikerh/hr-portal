import { Component } from '@angular/core';
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import {
    MatDatepickerModule,
    MatDatepickerToggle,
    MatDateRangeInput,
    MatDateRangePicker,
} from '@angular/material/datepicker';
import { JsonPipe } from '@angular/common';

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

        MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, JsonPipe
    ],
    templateUrl: './new-business-trip.component.html',
    styleUrl: './new-business-trip.component.scss',
})
export class NewBusinessTripComponent {
    businessTripForm: FormGroup;
    tripTypes: { value: string; viewValue: string }[] = [
        { value: 'steak-0', viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'tacos-2', viewValue: 'Tacos' },
    ];
    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.businessTripForm = this.fb.group({
            startDate: [''],
            endDate: [''],
            tripType: [''],
            destination: [''],
            purpose: [''],
            requestOwner: [''],
            employeeId: [''],
        });
    }
}
