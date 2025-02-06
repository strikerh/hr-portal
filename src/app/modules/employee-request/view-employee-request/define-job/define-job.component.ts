import { Component, Input } from '@angular/core';
import { ViewRequestService } from '../../view-request.service';
import { DatePipe, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-define-job-view',
  standalone: true,
  imports: [NgClass,DatePipe,MatIcon],
  templateUrl: './define-job.component.html',
  styleUrl: './define-job.component.scss'
})
export class DefineJobComponent {
@Input() request:any;
constructor(private veiw:ViewRequestService){
  console.log(this.request)
}
closeView(){
  this.veiw.setOpen(false)
}
}
