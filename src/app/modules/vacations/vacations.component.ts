import { DatePipe, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { SidePageService } from 'ngx-side-page';
import { firstValueFrom } from 'rxjs';
import { UploadComponent } from '../../components/upload/upload.component';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.types';
import { NewVacationComponent } from './new-vacation/new-vacation.component';
import { VacationsApiService } from './vacations-api.service';
import { GetAllLeaveTypesRemainingLeavesDTO, vacation } from './vacationsModels';

@Component({
    selector: 'app-vacations',
    standalone: true,
    imports: [
        MatButton,
        MatIcon,
        MatTabsModule,
        MatTableModule,
        NgIf,
        DatePipe,
        MatRipple,
        UploadComponent,
        NgForOf,
        TitleCasePipe,
    ],
    templateUrl: './vacations.component.html',
    styleUrl: './vacations.component.scss',
})
export class VacationsComponent implements OnInit {
    vacations: vacation[] = [];
    tripsNeedApproves: vacation[];
    displayedColumns1: string[] = [
        'id',
        // 'Sequence',
        'start_date',
        'end_date',
        'duration',
        'description',
        // 'employee_name',
        'state',
        'time_off_type',
    ];
    displayedColumns2: string[] = [
        'id',
        // 'Sequence',
        'employee_name',
        'start_date',
        'end_date',
        'duration',
        'description',
        'state',
        'time_off_type',
        'action1',
    ];
    tabIndex: 'needApprove' | 'myTrips' = 'myTrips';
    private user: User;

    private _snackBar = inject(MatSnackBar);
    dashboardData: GetAllLeaveTypesRemainingLeavesDTO;

    constructor(
        private sidePageService: SidePageService,
        private vacationApi: VacationsApiService,
        private userService: UserService
    ) {}

    async ngOnInit(): Promise<void> {
        const user = await firstValueFrom(this.userService.user$);
        this.user = user;
        this.reloadData();

        this.vacationApi.get_all_leave_types_remaining_leaves().subscribe((data) => {
            console.log(data);
            this.dashboardData = data;
        });
    }

    openNewBusinessTrip() {
        const ref = this.sidePageService.openSidePage('new-vacation', NewVacationComponent, {
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
            this.vacationApi.approveTrip(trip_id).subscribe(
                (data) => {
                    console.log(data);
                    this.openSnackBar(data.msg);
                },
                (error) => {
                    if (error.error.error) {
                        this.openSnackBar(error.error.error);
                    }
                    console.error(error);
                }
            );
        } else {
            this.vacationApi.refuse_trip(trip_id).subscribe((data) => {
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
        this.vacationApi.api_get_all_trip_by_employee_id().subscribe((data) => {
            this.vacations = data.time_off_list
                /*    .map((vacation: any)=>{
                    return {
                        ...vacation,
                        total_days: Math.floor((new Date(vacation.date_end).getTime() - new Date(vacation.date_start).getTime()) / (1000 * 60 * 60 * 24)),
                    };
                }).*/
                .sort((a, b) => b.id - a.id);
            console.log(data);
        });

        this.vacationApi.api_get_trips_to_approves_by_user_id().subscribe((data) => {
            // const g1 = data.time_off_list?.filter((trip) => trip.my_action === 'pending')?.sort((a, b) => b.id - a.id);
            // const g2 = data.time_off_list?.filter((trip) => trip.my_action !== 'pending')?.sort((a, b) => b.id - a.id);
            // this.tripsNeedApproves = [...g1, ...g2]

            this.tripsNeedApproves = data.time_off_list;

            console.log('tripsNeedApproves', data);
        });
    }
}
