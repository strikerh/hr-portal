import { DatePipe, DecimalPipe, NgIf, TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { SidePageService } from 'ngx-side-page';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.types';
import { BusinessTripApiService } from './business-trip-api.service';
import { Trip } from './businessTripModels';
import { NewBusinessTripComponent } from './new-business-trip/new-business-trip.component';
import { MatDatepickerModule, MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';

@Component({
    selector: 'app-business-trips',
    standalone: true,
    imports: [
        MatButton,
        MatIcon,
        MatTabsModule,
        MatTableModule,
        NgIf,
        DatePipe,
        MatRipple,
        TitleCasePipe,
        DecimalPipe,
        MatDatepickerModule,
        MatDateRangeInput,
        MatDatepickerToggle,
        MatDateRangePicker,
        ReactiveFormsModule,
        FormsModule,
        MatFormField,
    ],
    templateUrl: './business-trips.component.html',
    styleUrl: './business-trips.component.scss',
})
export class BusinessTripsComponent implements OnInit {
    trips: Trip[] = [];
    tripsNeedApproves: Trip[];
    moreInfoWrapperOpen: boolean = false;
    moreInfoWrapperData: any = {};
    filterOpened: boolean = false;
    filterForm: FormGroup;
    filteredMyRequestData: Trip[];
    filteredEmployeeData: Trip[];

    toggleFilter() {
        this.filterOpened = !this.filterOpened;
    }
    filter() {
        if (this.tabIndex == 'myTrips') {
            this.filteredMyRequestData = this.trips.filter(this.filterMethod.bind(this));
            console.log();
        } else {
            this.filteredEmployeeData = this.tripsNeedApproves.filter(this.filterMethod.bind(this));
        }
        this.toggleFilter();
    }
    filterMethod(item: Trip) {
        const filters = this.filterForm.value;
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
    openMoreInfo(id: number) {
        if (this.tabIndex == 'myTrips') {
            this.moreInfoWrapperData = this.trips.find((x) => x.id == id);
        } else {
            this.moreInfoWrapperData = this.tripsNeedApproves.find((x) => x.id == id);
        }
        setTimeout(() => {
            const wrapperElement = document.querySelector('.wrapper');
            if (wrapperElement) {
                // Scroll the wrapper element into view with smooth scrolling
                wrapperElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 0);

        this.moreInfoWrapperOpen = true;
    }
    toggle() {
        this.moreInfoWrapperOpen = !this.moreInfoWrapperOpen;
    }
    displayedColumns1: string[] = [
        // 'id',
        'Sequence',
        'date_end',
        'date_start',
        'employee',
        // 'total_days',
        // 'approval_cycle_type',
        'total_compensation',
        'status',
        'employee_grade',
        // 'location_trip',
        'trip_type',
        // 'request_manager',
        'project_id',
    ];
    displayedColumns2: string[] = [
        // 'id',
        'Sequence',
        'employee',
        'date_end',
        'date_start',
        'total_days',
        'total_compensation',
        'trip_type',
        'status',
        'my_action',
        'approval_cycle_type',
        'employee_grade',
        'location_trip',
        'action',
        'request_manager',
    ];
    displayedColumns3 = [
        'id',
        'Sequence',
        'date_end',
        'date_start',
        'employee',
        'status',
        'my_action',
        'approval_cycle_type',
        'employee_grade',
        'location_trip',
        'total_compensation',
        'total_days',
        'trip_type',
        'request_manager',
        'action',
    ];
    tabIndex: 'needApprove' | 'myTrips' = 'myTrips';
    private user: User;

    private _snackBar = inject(MatSnackBar);
    constructor(
        private fb: FormBuilder,
        private sidePageService: SidePageService,
        private businessTripApi: BusinessTripApiService,
        private userService: UserService
    ) {}

    async ngOnInit(): Promise<void> {
        this.filterForm = this.fb.group({
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
        const user = await firstValueFrom(this.userService.user$);
        this.user = user;
        this.reloadData();
    }

    openNewBusinessTrip() {
        const ref = this.sidePageService.openSidePage('new-vacation', NewBusinessTripComponent, {
            width: '40%',
            maxWidth: '600px',
        });

        ref.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            this.reloadData();
        });
    }

    doAction(approve: 'approve' | 'reject', trip_id: number) {
        if (approve === 'approve') {
            this.businessTripApi.approveTrip(trip_id).subscribe((data) => {
                console.log(data);
                this.openSnackBar(data.msg);
            });
        } else {
            this.businessTripApi.refuse_trip(trip_id).subscribe((data) => {
                this.openSnackBar(data.msg);
                console.log(data);
            });
        }
        this.reloadData();
    }

    openSnackBar(message: string, action: string = 'ok') {
        this._snackBar.open(message, action, {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000,
        });
    }

    private reloadData() {
        this.businessTripApi.api_get_all_trip_by_employee_id(Number(this.user.employeeId)).subscribe((data) => {
            this.trips = data.trips
                // .map((trip: any)=>{
                //     return {
                //         ...trip,
                //         total_days: Math.floor((new Date(trip.date_end).getTime() - new Date(trip.date_start).getTime()) / (1000 * 60 * 60 * 24)),
                //     };
                // }).
                ?.sort((a, b) => b.id - a.id);
            console.log('Displayed Columns:', this.displayedColumns3);
            console.log('Trips:', data);
        });

        this.businessTripApi.api_get_trips_to_approves_by_user_id().subscribe((data) => {
            console.log('a', data);
            const g1 = data.trips?.filter((trip) => trip.my_action === 'pending')?.sort((a, b) => b.id - a.id) || [];
            const g2 = data.trips?.filter((trip) => trip.my_action !== 'pending')?.sort((a, b) => b.id - a.id) || [];
            this.tripsNeedApproves = [...g1, ...g2];

            // this.tripsNeedApproves = data.trips;

            console.log('tripsNeedApproves', data);
        });
        console.log(this.trips);
    }
}
