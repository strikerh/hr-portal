import { Component, Input } from '@angular/core';
import { ViewRequestService } from '../../view-request.service';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-salary-slip',
  standalone: true,
  imports: [NgClass,MatIcon],
  templateUrl: './salary-slip.component.html',
  styleUrl: './salary-slip.component.scss'
})
export class SalarySlipComponent {
@Input() request:any;
constructor(private veiw:ViewRequestService){
  console.log(this.request)
}
closeView(){
  this.veiw.setOpen(false)
}
}
