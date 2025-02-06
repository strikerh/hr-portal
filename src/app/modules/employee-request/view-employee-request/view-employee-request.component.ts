import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DefineJobComponent } from "../view-employee-request/define-job/define-job.component";
import { BusinessCardComponent } from './business-card/business-card.component';
import { SalaryClearanceComponent } from './salary-clearance/salary-clearance.component';
import { SalarySlipComponent } from './salary-slip/salary-slip.component';
import { UpdateEmployeeDataComponent } from './update-employee-data/update-employee-data.component';
import { CreateEmployeeRequestComponent } from "../create-employee-request/create-employee-request.component";
import { ViewRequestService } from '../view-request.service';

@Component({
  selector: 'app-view-employee-request',
  standalone: true,
  imports: [DefineJobComponent, BusinessCardComponent, SalaryClearanceComponent, SalarySlipComponent, UpdateEmployeeDataComponent, CreateEmployeeRequestComponent],
  templateUrl: './view-employee-request.component.html',
  styleUrl: './view-employee-request.component.scss'
})
export class ViewEmployeeRequestComponent implements OnInit,OnDestroy {
@Input() request:any;
constructor(private view:ViewRequestService){

}
ngOnInit(): void {
  console.log(this.request)
  window.history.pushState(null, '', window.location.href);

  // Use an arrow function to keep 'this' bound to the component instance
  window.addEventListener('popstate', (event) => this.onBackPressed());
}
ngOnDestroy(): void {
  this.view.setOpen(false);
}
onBackPressed() {
  // Ensure that `this.view` is defined
  this.view.setOpen(false);
}

}
