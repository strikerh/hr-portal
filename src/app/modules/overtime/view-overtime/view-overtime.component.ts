import { Component, inject, Input, OnInit } from '@angular/core';
import { ViewRequestService } from '../view-request.service';
import { OvertimeService } from '../overtime.service';
import { environment } from 'environments/environment';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { SIDE_PAGE_DATA, SIDE_PAGE_REF, SidePageInfo, SidePageRef, SidePageService } from 'ngx-side-page';

@Component({
    selector: 'app-view-overtime',
    standalone: true,
    imports: [MatIcon, NgIf, NgFor, NgClass, CommonModule, MatButton],
    templateUrl: './view-overtime.component.html',
    styleUrl: './view-overtime.component.scss',
})
export class ViewOvertimeComponent implements OnInit {
    @Input() request: any;
    files: any;
    projects: any[] = [];
    salaryInfo: any;
    totalSalary: number;
    wage: number;
    workingHours: number;
    totalPaidForWorkingDay: number;
    totalPaidForWorkingHoliday: number;
    data: any;
    sidePage: boolean = false;

    readonly requestData: SidePageInfo<ViewOvertimeComponent> | null= inject(SIDE_PAGE_DATA,{ optional: true });
    readonly refs: SidePageRef<ViewOvertimeComponent> | null = inject(SIDE_PAGE_REF,{ optional: true });

    constructor(
        private view: ViewRequestService,
        private api: OvertimeService
    ) {}
    ngOnInit(): void {
        console.log(this.request);
        if (this.request) {
            this.data = this.request;
            console.log(this.data);
        }
        if(this.requestData){
        if(this.requestData.data){
            this.data=this.requestData.data;
            this.sidePage=true
        }}
        window.history.pushState(null, '', window.location.href);

        window.addEventListener('popstate', (event) => this.onBackPressed());
        this.api.getProject().subscribe({
            next: (response: any) => {
                this.projects = response.projects;
            },
        });

        this.api.getSalaryInfo(this.data.employee_id).subscribe({
            next: (response) => {
                console.log(response);
                this.salaryInfo = response;
                this.calc();
            },
        });
    }
    getProjectName(id) {
        return this.projects.find((m) => m.id === id)?.name || '';
    }
    ngOnDestroy(): void {
        this.view.setOpen(false);
    }
    onBackPressed() {
        this.view.setOpen(false);
    }

    overtimeAmountFromToatlSalaryDay: number;
    overtimeAmountFromWageDay: number;
    amountPerHourDay: number;
    totalOvertimeHoursDay: number;
    overtimeAmountFromToatlSalaryHoliday: number;
    overtimeAmountFromWageHoliday: number;
    amountPerHourHoliday: number;
    totalOvertimeHoursHoliday: number;

    calc() {
        const workdays = this.data.overtime_list.filter((item) => item.day_type === 'workday');

        this.overtimeAmountFromToatlSalaryDay =
            this.salaryInfo.total_salary / 30 / this.salaryInfo.working_hour_per_day;

        this.overtimeAmountFromWageDay = this.salaryInfo.wage / 30 / this.salaryInfo.working_hour_per_day;

        this.amountPerHourDay = 0.5 * this.overtimeAmountFromWageDay + this.overtimeAmountFromToatlSalaryDay;

        this.totalOvertimeHoursDay = workdays.reduce((sum, item) => sum + item.overtime_duration, 0);

        this.totalPaidForWorkingDay = this.amountPerHourDay * this.totalOvertimeHoursDay;

        const holidays = this.data.overtime_list.filter((item) => item.day_type === 'holiday');
        this.overtimeAmountFromToatlSalaryHoliday =
            this.salaryInfo.total_salary / 30 / this.salaryInfo.working_hour_per_day;
        this.overtimeAmountFromWageHoliday = this.salaryInfo.wage / 30 / this.salaryInfo.working_hour_per_day;

        this.amountPerHourHoliday = this.overtimeAmountFromWageHoliday + this.overtimeAmountFromToatlSalaryHoliday;
        this.totalOvertimeHoursHoliday = holidays.reduce((sum, item) => sum + item.overtime_duration, 0);
        this.totalPaidForWorkingHoliday = this.amountPerHourHoliday * this.totalOvertimeHoursHoliday;
        console.log(workdays);
        console.log(holidays);
    }

    seeMore(){
        this.refs.close({seeMore: true});
    }
}
