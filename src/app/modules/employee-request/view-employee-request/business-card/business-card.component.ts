import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ViewRequestService } from '../../view-request.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-business-card',
  standalone: true,
  imports: [NgClass,MatIcon],
  templateUrl: './business-card.component.html',
  styleUrl: './business-card.component.scss'
})
export class BusinessCardComponent {
@Input() request:any;
constructor(private veiw:ViewRequestService){
  console.log(this.request)
}
closeView(){
  this.veiw.setOpen(false)
}
}
